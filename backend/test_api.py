"""
Automated Backend & Model Integration Verification Test
Tests all REST endpoints using Flask's native test_client (no socket permissions needed).
"""

import json
from app import app

def run_tests():
    client = app.test_client()
    
    print("\n--- 1. Testing GET /api/health ---")
    r = client.get('/api/health')
    print(f"Status: {r.status_code}")
    data = r.get_json()
    print(f"Response: {data}")
    assert r.status_code == 200
    assert data['model_loaded'] is True
    
    print("\n--- 2. Testing GET /api/analytics ---")
    r = client.get('/api/analytics')
    print(f"Status: {r.status_code}")
    res = r.get_json()
    assert r.status_code == 200
    analytics = res['data']
    print(f"R² Score: {analytics['metrics']['r2_score']}")
    print(f"RMSE: ₹{analytics['metrics']['rmse']:,.2f}")
    print(f"Total Dataset Records: {analytics['dataset_stats']['total_records']}")
    assert analytics['metrics']['r2_score'] > 0.8
    
    print("\n--- 3. Testing POST /api/predict ---")
    payload = {
        "City": "Bangalore",
        "Area_sqft": 1600,
        "BHK": 3,
        "Bathrooms": 3,
        "Floors": 1,
        "Property_Age": 3,
        "Parking": "Yes",
        "Furnishing": "Semi-Furnished",
        "Property_Type": "Apartment"
    }
    r = client.post('/api/predict', json=payload)
    print(f"Status: {r.status_code}")
    pred = r.get_json()
    print(f"Predicted Price: {pred['formatted_price']['combined']}")
    print(f"Price Range: {pred['price_range']['formatted_lower']['compact']} to {pred['price_range']['formatted_upper']['compact']}")
    print(f"Rate: {pred['formatted_price_per_sqft']}")
    assert r.status_code == 200
    assert pred['success'] is True
    assert pred['predicted_price'] > 5000000
    record_id = pred['prediction_id']
    
    print("\n--- 4. Testing GET /api/history ---")
    r = client.get('/api/history')
    print(f"Status: {r.status_code}")
    hist = r.get_json()
    print(f"History records count: {hist['count']}")
    assert hist['count'] >= 1
    
    print(f"\n--- 5. Testing DELETE /api/history/{record_id} ---")
    r = client.delete(f'/api/history/{record_id}')
    print(f"Status: {r.status_code}")
    assert r.status_code == 200
    
    print("\n--- 6. Testing GET /api/download-dataset ---")
    r = client.get('/api/download-dataset')
    print(f"Status: {r.status_code}")
    assert r.status_code == 200
    assert len(r.data) > 10000
    
    print("\n>>> ALL 6 BACKEND API & ML INFERENCE TESTS PASSED COMPLETELY! <<<\n")

if __name__ == '__main__':
    run_tests()
