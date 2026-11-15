"""
House Price Prediction - Model Training Pipeline
Uses Scikit-learn Linear Regression with automated data preprocessing,
one-hot encoding, feature scaling, rigorous evaluation, and artifact serialization.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

def train_and_evaluate():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dataset_path = os.path.join(base_dir, 'dataset', 'house_prices.csv')
    model_dir = os.path.join(base_dir, 'model')
    charts_dir = os.path.join(model_dir, 'static_charts')
    os.makedirs(charts_dir, exist_ok=True)
    
    print(f"1. Loading dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path)
    print(f"   Loaded {len(df)} records with {df.shape[1]} columns.")
    
    # 2. Data Cleaning & Integrity Check
    null_counts = df.isnull().sum()
    print("   Missing value verification:")
    print(null_counts)
    if null_counts.sum() > 0:
        print("   Handling missing values...")
        df = df.dropna()
        
    # Feature columns
    numerical_features = ['Area_sqft', 'BHK', 'Bathrooms', 'Floors', 'Property_Age']
    categorical_features = ['City', 'Parking', 'Furnishing', 'Property_Type']
    target_column = 'Price_INR'
    
    X = df[numerical_features + categorical_features]
    y = df[target_column]
    
    # 3. Train-Test Split (80:20)
    print("2. Splitting data into 80% training and 20% testing sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )
    print(f"   Training samples: {len(X_train)}, Testing samples: {len(X_test)}")
    
    # 4. Preprocessing Pipeline
    # OneHotEncoder with handle_unknown='ignore' guarantees safe handling of any unseen category
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(drop='first', handle_unknown='ignore', sparse_output=False), categorical_features)
        ]
    )
    
    # 5. Full Machine Learning Pipeline
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', LinearRegression())
    ])
    
    # 6. Model Training
    print("3. Training Scikit-learn Linear Regression model...")
    model_pipeline.fit(X_train, y_train)
    print("   Model training complete.")
    
    # 7. Model Evaluation on Testing Set
    print("4. Evaluating model on unseen test set (1,000 samples)...")
    y_pred = model_pipeline.predict(X_test)
    
    r2 = float(r2_score(y_test, y_pred))
    mae = float(mean_absolute_error(y_test, y_pred))
    mse = float(mean_squared_error(y_test, y_pred))
    rmse = float(np.sqrt(mse))
    
    # Mean Absolute Percentage Error (MAPE)
    mape = float(np.mean(np.abs((y_test - y_pred) / y_test)) * 100)
    
    print("   ================ Model Performance Metrics ================")
    print(f"   R² Score (Coefficient of Determination) : {r2:.4f} ({r2*100:.2f}%)")
    print(f"   Mean Absolute Error (MAE)              : ₹{mae:,.2f}")
    print(f"   Mean Squared Error (MSE)               : ₹{mse:,.2f}")
    print(f"   Root Mean Squared Error (RMSE)         : ₹{rmse:,.2f}")
    print(f"   Mean Absolute Percentage Error (MAPE)  : {mape:.2f}%")
    print("   ===========================================================")
    
    # 8. Feature Names & Regression Coefficients Extraction
    fitted_preprocessor = model_pipeline.named_steps['preprocessor']
    regressor = model_pipeline.named_steps['regressor']
    
    cat_encoder = fitted_preprocessor.named_transformers_['cat']
    encoded_cat_names = cat_encoder.get_feature_names_out(categorical_features).tolist()
    all_feature_names = numerical_features + encoded_cat_names
    coefficients = regressor.coef_.tolist()
    intercept = float(regressor.intercept_)
    
    feature_coefficients = []
    for name, coef in zip(all_feature_names, coefficients):
        feature_coefficients.append({
            'feature': name,
            'coefficient': float(coef),
            'formatted_coef': f"₹{coef:+,.2f}",
            'impact': 'Positive' if coef > 0 else 'Negative'
        })
        
    # Sort feature coefficients by absolute impact
    feature_coefficients.sort(key=lambda x: abs(x['coefficient']), reverse=True)
    
    # 9. Compute Dataset Statistics for Analytics Dashboard
    dataset_stats = {
        'total_records': int(len(df)),
        'training_records': int(len(X_train)),
        'testing_records': int(len(X_test)),
        'avg_price': float(df['Price_INR'].mean()),
        'median_price': float(df['Price_INR'].median()),
        'min_price': float(df['Price_INR'].min()),
        'max_price': float(df['Price_INR'].max()),
        'avg_area_sqft': float(df['Area_sqft'].mean()),
        'min_area_sqft': float(df['Area_sqft'].min()),
        'max_area_sqft': float(df['Area_sqft'].max()),
        'avg_bhk': float(df['BHK'].mean()),
        'avg_property_age': float(df['Property_Age'].mean()),
        'cities': sorted(df['City'].unique().tolist()),
        'property_types': sorted(df['Property_Type'].unique().tolist()),
        'furnishing_types': sorted(df['Furnishing'].unique().tolist())
    }
    
    # 10. Prepare Chart Data for Frontend Dashboards
    # Sample 150 points from test set for Actual vs Predicted and Area vs Price
    sample_indices = np.random.choice(len(y_test), size=min(150, len(y_test)), replace=False)
    actual_sample = y_test.iloc[sample_indices].tolist()
    pred_sample = y_pred[sample_indices].tolist()
    area_sample = X_test['Area_sqft'].iloc[sample_indices].tolist()
    city_sample = X_test['City'].iloc[sample_indices].tolist()
    
    # Price distribution bins (12 histogram bins)
    hist, bin_edges = np.histogram(df['Price_INR'] / 100000.0, bins=12) # in Lakhs
    price_distribution = {
        'bins': [f"₹{int(bin_edges[i])}-{int(bin_edges[i+1])}L" for i in range(len(hist))],
        'counts': hist.tolist()
    }
    
    # City average price
    city_avg_price = df.groupby('City')['Price_INR'].mean().sort_values(ascending=False).to_dict()
    
    # Property type average price
    type_avg_price = df.groupby('Property_Type')['Price_INR'].mean().sort_values(ascending=False).to_dict()
    
    analytics_payload = {
        'metrics': {
            'r2_score': round(r2, 4),
            'r2_percentage': round(r2 * 100, 2),
            'mae': round(mae, 2),
            'mse': round(mse, 2),
            'rmse': round(rmse, 2),
            'mape': round(mape, 2),
            'intercept': round(intercept, 2)
        },
        'dataset_stats': dataset_stats,
        'feature_importance': feature_coefficients,
        'chart_data': {
            'actual_vs_predicted': [
                {'actual': round(a, 0), 'predicted': round(p, 0), 'area': ar, 'city': c}
                for a, p, ar, c in zip(actual_sample, pred_sample, area_sample, city_sample)
            ],
            'price_distribution': price_distribution,
            'city_avg_price': {k: round(v, 0) for k, v in city_avg_price.items()},
            'type_avg_price': {k: round(v, 0) for k, v in type_avg_price.items()}
        }
    }
    
    # 11. Save Trained Pipeline & Metadata
    model_save_path = os.path.join(model_dir, 'house_price_model.joblib')
    metrics_save_path = os.path.join(model_dir, 'metrics.json')
    feature_imp_path = os.path.join(model_dir, 'feature_importance.json')
    analytics_path = os.path.join(model_dir, 'analytics_data.json')
    
    print(f"5. Saving trained model pipeline to: {model_save_path}")
    joblib.dump(model_pipeline, model_save_path)
    
    print(f"   Saving metrics to: {metrics_save_path}")
    with open(metrics_save_path, 'w') as f:
        json.dump(analytics_payload['metrics'], f, indent=2)
        
    print(f"   Saving feature importance to: {feature_imp_path}")
    with open(feature_imp_path, 'w') as f:
        json.dump(feature_coefficients, f, indent=2)
        
    print(f"   Saving analytics payload to: {analytics_path}")
    with open(analytics_path, 'w') as f:
        json.dump(analytics_payload, f, indent=2)
        
    # 12. Generate Static High-Resolution Charts using Seaborn / Matplotlib
    print("6. Generating static publication-ready Seaborn/Matplotlib charts...")
    sns.set_theme(style="whitegrid", palette="muted")
    
    # Chart 1: Actual vs Predicted
    plt.figure(figsize=(8, 6))
    plt.scatter(y_test / 1e5, y_pred / 1e5, alpha=0.5, color='#2563eb', edgecolors='none', s=25)
    max_val = max(y_test.max(), y_pred.max()) / 1e5
    plt.plot([0, max_val], [0, max_val], 'r--', lw=2, label='Perfect Fit (y = x)')
    plt.title(f'Actual vs Predicted House Prices (R² = {r2:.3f})', fontsize=14, fontweight='bold', pad=12)
    plt.xlabel('Actual Price (₹ Lakhs)', fontsize=11)
    plt.ylabel('Predicted Price (₹ Lakhs)', fontsize=11)
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(charts_dir, 'actual_vs_predicted.png'), dpi=200)
    plt.close()
    
    # Chart 2: House Price Distribution
    plt.figure(figsize=(8, 6))
    sns.histplot(df['Price_INR'] / 1e5, bins=30, kde=True, color='#059669', stat='density')
    plt.title('House Price Distribution (in ₹ Lakhs)', fontsize=14, fontweight='bold', pad=12)
    plt.xlabel('Price (₹ Lakhs)', fontsize=11)
    plt.ylabel('Density', fontsize=11)
    plt.tight_layout()
    plt.savefig(os.path.join(charts_dir, 'price_distribution.png'), dpi=200)
    plt.close()
    
    # Chart 3: Area vs Price
    plt.figure(figsize=(8, 6))
    sns.scatterplot(data=df, x='Area_sqft', y=df['Price_INR'] / 1e5, hue='Property_Type', alpha=0.7, palette='tab10')
    plt.title('Property Area (sq ft) vs Listing Price (₹ Lakhs)', fontsize=14, fontweight='bold', pad=12)
    plt.xlabel('Area (Square Feet)', fontsize=11)
    plt.ylabel('Price (₹ Lakhs)', fontsize=11)
    plt.tight_layout()
    plt.savefig(os.path.join(charts_dir, 'area_vs_price.png'), dpi=200)
    plt.close()
    
    # Chart 4: Top Feature Coefficients
    plt.figure(figsize=(10, 6))
    top_features = feature_coefficients[:10]
    feat_names = [f['feature'] for f in top_features][::-1]
    feat_vals = [f['coefficient'] / 1e5 for f in top_features][::-1] # in Lakhs
    colors = ['#10b981' if v > 0 else '#ef4444' for v in feat_vals]
    plt.barh(feat_names, feat_vals, color=colors)
    plt.title('Linear Regression Standardized Feature Weights (₹ Lakhs impact)', fontsize=14, fontweight='bold', pad=12)
    plt.xlabel('Model Coefficient Value (₹ Lakhs)', fontsize=11)
    plt.axvline(0, color='gray', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plt.savefig(os.path.join(charts_dir, 'feature_importance.png'), dpi=200)
    plt.close()
    
    print("   All charts successfully saved to model/static_charts/")
    print("\n>>> Machine Learning Training Pipeline Completed Successfully! <<<\n")
    return analytics_payload

if __name__ == '__main__':
    train_and_evaluate()
