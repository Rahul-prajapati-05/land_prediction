"""
HomePrice AI - Flask REST Backend API
Provides endpoints for machine learning price prediction, analytics, history management,
and dataset downloads.
"""

import os
import json
import joblib
import pandas as pd
from datetime import datetime
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS

from database import (
    init_db, save_prediction, get_all_history, 
    delete_single_history, clear_all_history,
    save_contact_inquiry, get_contact_inquiries
)
from utils import format_inr, calculate_prediction_interval, validate_prediction_input
import requests

ADMIN_EMAIL = "rahulprajapati1480@gmail.com"

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'model', 'house_price_model.joblib')
ANALYTICS_PATH = os.path.join(BASE_DIR, 'model', 'analytics_data.json')
DATASET_PATH = os.path.join(BASE_DIR, 'dataset', 'house_prices.csv')
STATIC_DIST_PATH = os.path.join(BASE_DIR, 'frontend', 'dist')

app = Flask(__name__, static_folder=STATIC_DIST_PATH, static_url_path='')
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Global ML model and analytics cache
MODEL_PIPELINE = None
ANALYTICS_DATA = {}
MODEL_RMSE = 6441920.0

def load_ml_artifacts():
    global MODEL_PIPELINE, ANALYTICS_DATA, MODEL_RMSE
    print(f"Loading ML model pipeline from: {MODEL_PATH}")
    if os.path.exists(MODEL_PATH):
        MODEL_PIPELINE = joblib.load(MODEL_PATH)
        print("Scikit-learn Linear Regression model pipeline loaded successfully.")
    else:
        print(f"WARNING: Model file not found at {MODEL_PATH}. Train the model first.")
        
    if os.path.exists(ANALYTICS_PATH):
        with open(ANALYTICS_PATH, 'r') as f:
            ANALYTICS_DATA = json.load(f)
            MODEL_RMSE = ANALYTICS_DATA.get('metrics', {}).get('rmse', 6441920.0)
        print(f"Loaded analytics data with R²: {ANALYTICS_DATA.get('metrics', {}).get('r2_score')}")
    else:
        print(f"WARNING: Analytics data not found at {ANALYTICS_PATH}.")

# Initialize Database and ML Model
init_db()
load_ml_artifacts()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint providing status of backend & ML model."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'model_loaded': MODEL_PIPELINE is not None,
        'algorithm': 'Linear Regression (Ordinary Least Squares)',
        'framework': 'Scikit-learn',
        'version': '1.0.0'
    }), 200

@app.route('/api/predict', methods=['POST'])
def predict_house_price():
    """
    Predicts house valuation using the real trained Scikit-learn Linear Regression pipeline.
    Validates input, computes point estimate and interval, saves to history, and returns full details.
    """
    if MODEL_PIPELINE is None:
        return jsonify({
            'success': False,
            'error': 'Machine learning model is not loaded on the server. Please ensure the model is trained.'
        }), 503
        
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'success': False, 'error': 'Invalid JSON request payload.'}), 400
        
    is_valid, err_msg, cleaned = validate_prediction_input(data)
    if not is_valid:
        return jsonify({'success': False, 'error': err_msg}), 400
        
    try:
        # Convert single instance to Pandas DataFrame with identical column schema
        input_df = pd.DataFrame([cleaned])
        
        # Real inference using Scikit-learn pipeline
        predicted_val = float(MODEL_PIPELINE.predict(input_df)[0])
        
        # Ensure non-negative baseline price
        predicted_val = max(1000000.0, predicted_val) # Minimum ₹10 Lakhs
        
        # Compute interval and formatting
        formatted = format_inr(predicted_val)
        interval = calculate_prediction_interval(predicted_val, MODEL_RMSE)
        price_per_sqft = round(predicted_val / cleaned['Area_sqft'], 2)
        
        # Save prediction into SQLite History
        history_record = {
            'city': cleaned['City'],
            'area_sqft': cleaned['Area_sqft'],
            'bhk': cleaned['BHK'],
            'bathrooms': cleaned['Bathrooms'],
            'floors': cleaned['Floors'],
            'property_age': cleaned['Property_Age'],
            'parking': cleaned['Parking'],
            'furnishing': cleaned['Furnishing'],
            'property_type': cleaned['Property_Type'],
            'predicted_price': predicted_val,
            'price_lower': interval['lower'],
            'price_upper': interval['upper'],
            'formatted_price': formatted['combined']
        }
        record_id = save_prediction(history_record)
        
        # City benchmark comparative metric
        city_avg = ANALYTICS_DATA.get('chart_data', {}).get('city_avg_price', {}).get(cleaned['City'], None)
        diff_from_city_avg = None
        if city_avg:
            diff_from_city_avg = round(((predicted_val - city_avg) / city_avg) * 100, 1)
            
        return jsonify({
            'success': True,
            'prediction_id': record_id,
            'predicted_price': predicted_val,
            'formatted_price': formatted,
            'price_range': {
                'lower': interval['lower'],
                'upper': interval['upper'],
                'formatted_lower': interval['formatted_lower'],
                'formatted_upper': interval['formatted_upper'],
                'margin_percent': interval['margin_percent']
            },
            'price_per_sqft': price_per_sqft,
            'formatted_price_per_sqft': f"₹{price_per_sqft:,.2f} / sq.ft",
            'city_benchmark': {
                'city_avg': city_avg,
                'diff_percent': diff_from_city_avg
            },
            'inputs': cleaned,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f"Prediction calculation failed: {str(e)}"
        }), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Retrieves previous predictions with timestamps, features, and valuations."""
    try:
        limit = request.args.get('limit', default=100, type=int)
        history = get_all_history(limit=limit)
        return jsonify({
            'success': True,
            'count': len(history),
            'history': history
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/history/<int:record_id>', methods=['DELETE'])
def delete_history_item(record_id):
    """Deletes a single prediction entry from history."""
    try:
        deleted = delete_single_history(record_id)
        if deleted:
            return jsonify({'success': True, 'message': f'Record {record_id} deleted.'}), 200
        else:
            return jsonify({'success': False, 'error': f'Record {record_id} not found.'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/history', methods=['DELETE'])
def clear_history():
    """Clears all stored prediction history."""
    try:
        clear_all_history()
        return jsonify({'success': True, 'message': 'All prediction history cleared.'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Returns dataset metrics, R2 score, MAE, MSE, RMSE, and chart series."""
    if not ANALYTICS_DATA:
        return jsonify({'success': False, 'error': 'Analytics data not available.'}), 503
    return jsonify({
        'success': True,
        'data': ANALYTICS_DATA
    }), 200

@app.route('/api/contact', methods=['POST'])
def submit_contact_inquiry():
    """
    Receives contact/inquiry message, persists in SQLite, and forwards
    directly to Rahul Prajapati's email (rahulprajapati1480@gmail.com).
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'success': False, 'error': 'Invalid JSON payload.'}), 400
        
    name = str(data.get('name', '')).strip()
    email = str(data.get('email', '')).strip()
    subject = str(data.get('subject', 'HomePrice AI Inquiry')).strip()
    message = str(data.get('message', '')).strip()
    
    if not name or not email or not message:
        return jsonify({'success': False, 'error': 'Name, email, and message are required.'}), 400
        
    try:
        # 1. Save inquiry into local SQLite database
        inquiry_id = save_contact_inquiry(name, email, subject, message)
        
        # 2. Forward notification to Rahul Prajapati's Gmail via FormSubmit
        forward_success = False
        try:
            formsubmit_url = f"https://formsubmit.co/ajax/{ADMIN_EMAIL}"
            payload = {
                'name': name,
                'email': email,
                '_subject': f"HomePrice AI New Inquiry: {subject}",
                'message': message,
                '_template': 'table'
            }
            res = requests.post(formsubmit_url, json=payload, timeout=5)
            if res.status_code == 200:
                forward_success = True
        except Exception as mail_err:
            print(f"[!] Email dispatch note: {mail_err} (Inquiry safely saved in DB)")
            
        return jsonify({
            'success': True,
            'inquiry_id': inquiry_id,
            'message': 'Your message has been sent to Rahul Prajapati (rahulprajapati1480@gmail.com)!',
            'saved_in_db': True,
            'email_forwarded': forward_success
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/contact', methods=['GET'])
def list_contact_inquiries():
    """Lists saved contact inquiries for administrative audit."""
    try:
        limit = request.args.get('limit', default=50, type=int)
        inquiries = get_contact_inquiries(limit=limit)
        return jsonify({
            'success': True,
            'count': len(inquiries),
            'inquiries': inquiries
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/download-dataset', methods=['GET'])
def download_dataset():
    """Serves the 5,000-listing housing dataset CSV file for direct download."""
    if os.path.exists(DATASET_PATH):
        return send_file(
            DATASET_PATH,
            mimetype='text/csv',
            as_attachment=True,
            download_name='indian_metro_house_prices_5000.csv'
        )
    return jsonify({'success': False, 'error': 'Dataset file not found.'}), 404

# Serve frontend build in production
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if STATIC_DIST_PATH and os.path.exists(STATIC_DIST_PATH):
        if path != "" and os.path.exists(os.path.join(STATIC_DIST_PATH, path)):
            return send_from_directory(STATIC_DIST_PATH, path)
        index_file = os.path.join(STATIC_DIST_PATH, 'index.html')
        if os.path.exists(index_file):
            return send_file(index_file)
            
    return jsonify({
        'name': 'HomePrice AI API Server',
        'status': 'Online',
        'endpoints': [
            '/api/health',
            '/api/predict',
            '/api/history',
            '/api/analytics',
            '/api/download-dataset'
        ],
        'note': 'Frontend is running separately on Vite dev server (default port 5173) or can be built into frontend/dist.'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting HomePrice AI Flask Backend on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
