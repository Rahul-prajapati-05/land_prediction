"""
Dataset Generator for Indian Metro House Price Prediction
Generates a realistic, statistically coherent dataset of 5,000 property listings
across 8 major Indian metropolises for machine learning training and evaluation.
"""

import numpy as np
import pandas as pd
import os

def generate_house_prices_dataset(num_records=5000, random_seed=42):
    np.random.seed(random_seed)
    
    cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad']
    # Realistic base sqft price ranges per city in INR
    city_base_rate = {
        'Mumbai': 16500,     # Premium metro
        'Delhi': 11000,      # NCR region
        'Bangalore': 8800,   # Silicon Valley of India
        'Hyderabad': 6800,   # IT & Pharma hub
        'Pune': 6500,        # IT & Auto hub
        'Chennai': 6400,     # Southern industrial hub
        'Kolkata': 4800,     # Cultural / eastern metro
        'Ahmedabad': 4200    # Western commerce hub
    }
    
    city_weights = [0.18, 0.16, 0.18, 0.14, 0.12, 0.10, 0.06, 0.06]
    
    property_types = ['Apartment', 'Independent House', 'Villa', 'Penthouse']
    property_type_weights = [0.65, 0.18, 0.12, 0.05]
    property_type_multiplier = {
        'Apartment': 1.0,
        'Independent House': 1.25,
        'Villa': 1.55,
        'Penthouse': 1.70
    }
    
    furnishing_statuses = ['Unfurnished', 'Semi-Furnished', 'Furnished']
    furnishing_weights = [0.30, 0.45, 0.25]
    furnishing_premium = {
        'Unfurnished': 0,
        'Semi-Furnished': 350000,
        'Furnished': 850000
    }
    
    selected_cities = np.random.choice(cities, size=num_records, p=city_weights)
    selected_types = np.random.choice(property_types, size=num_records, p=property_type_weights)
    selected_furnishing = np.random.choice(furnishing_statuses, size=num_records, p=furnishing_weights)
    
    # Parking probability (Villas/Penthouses almost always have parking, Apartments ~75%)
    parking_list = []
    for p_type in selected_types:
        if p_type in ['Villa', 'Penthouse']:
            parking_list.append(np.random.choice(['Yes', 'No'], p=[0.95, 0.05]))
        elif p_type == 'Independent House':
            parking_list.append(np.random.choice(['Yes', 'No'], p=[0.85, 0.15]))
        else:
            parking_list.append(np.random.choice(['Yes', 'No'], p=[0.72, 0.28]))
            
    # BHK distribution based on property type
    bhk_list = []
    area_list = []
    bathrooms_list = []
    floors_list = []
    age_list = []
    
    for i in range(num_records):
        p_type = selected_types[i]
        if p_type == 'Apartment':
            bhk = np.random.choice([1, 2, 3, 4], p=[0.20, 0.45, 0.28, 0.07])
            # Area proportional to BHK with natural variation
            mean_area = {1: 600, 2: 1050, 3: 1550, 4: 2200}[bhk]
            std_area = {1: 70, 2: 120, 3: 180, 4: 250}[bhk]
            area = int(np.clip(np.random.normal(mean_area, std_area), 420, 3500))
            bathrooms = min(bhk + np.random.choice([0, 1], p=[0.8, 0.2]), 5)
            floors = 1  # unit floor level or internal floors (1 for typical apt)
            age = int(np.clip(np.random.exponential(scale=7), 0, 30))
        elif p_type == 'Independent House':
            bhk = np.random.choice([2, 3, 4, 5], p=[0.20, 0.45, 0.25, 0.10])
            mean_area = {2: 1250, 3: 1800, 4: 2600, 5: 3400}[bhk]
            std_area = {2: 150, 3: 200, 4: 300, 5: 350}[bhk]
            area = int(np.clip(np.random.normal(mean_area, std_area), 850, 4500))
            bathrooms = bhk
            floors = np.random.choice([1, 2, 3], p=[0.35, 0.50, 0.15])
            age = int(np.clip(np.random.exponential(scale=10), 0, 35))
        elif p_type == 'Villa':
            bhk = np.random.choice([3, 4, 5], p=[0.30, 0.50, 0.20])
            mean_area = {3: 2200, 4: 3100, 5: 4200}[bhk]
            std_area = {3: 250, 4: 350, 5: 450}[bhk]
            area = int(np.clip(np.random.normal(mean_area, std_area), 1600, 5800))
            bathrooms = bhk + np.random.choice([0, 1], p=[0.4, 0.6])
            floors = np.random.choice([2, 3, 4], p=[0.60, 0.35, 0.05])
            age = int(np.clip(np.random.exponential(scale=5), 0, 25))
        else: # Penthouse
            bhk = np.random.choice([3, 4, 5], p=[0.25, 0.50, 0.25])
            mean_area = {3: 2500, 4: 3600, 5: 4800}[bhk]
            std_area = {3: 300, 4: 400, 5: 500}[bhk]
            area = int(np.clip(np.random.normal(mean_area, std_area), 1900, 6000))
            bathrooms = bhk + 1
            floors = np.random.choice([1, 2], p=[0.70, 0.30])
            age = int(np.clip(np.random.exponential(scale=4), 0, 20))
            
        bhk_list.append(bhk)
        area_list.append(area)
        bathrooms_list.append(bathrooms)
        floors_list.append(floors)
        age_list.append(age)
        
    prices = []
    for i in range(num_records):
        city = selected_cities[i]
        p_type = selected_types[i]
        area = area_list[i]
        bhk = bhk_list[i]
        baths = bathrooms_list[i]
        flrs = floors_list[i]
        age = age_list[i]
        park = parking_list[i]
        furn = selected_furnishing[i]
        
        # Fundamental valuation formula based on real estate econometrics:
        base_rate = city_base_rate[city]
        type_mult = property_type_multiplier[p_type]
        
        # Base valuation from land/construction area
        area_price = area * base_rate * type_mult
        
        # Amenities & specifications value
        bhk_value = bhk * 250000
        bath_value = baths * 180000
        floors_value = flrs * 120000
        parking_value = 450000 if park == 'Yes' else 0
        furn_val = furnishing_premium[furn]
        
        # Age depreciation: ~0.8% per year of age on construction portion
        depreciation_factor = max(0.65, 1.0 - (age * 0.009))
        
        # Core valuation
        raw_price = (area_price * depreciation_factor) + bhk_value + bath_value + floors_value + parking_value + furn_val
        
        # Realistic econometric noise (Gaussian with standard deviation ~ 5% of price)
        noise = np.random.normal(0, raw_price * 0.045)
        final_price = max(1500000, raw_price + noise) # Minimum 15 Lakhs
        
        # Round to nearest 10,000 INR
        rounded_price = int(round(final_price / 10000.0) * 10000)
        prices.append(rounded_price)
        
    df = pd.DataFrame({
        'City': selected_cities,
        'Area_sqft': area_list,
        'BHK': bhk_list,
        'Bathrooms': bathrooms_list,
        'Floors': floors_list,
        'Property_Age': age_list,
        'Parking': parking_list,
        'Furnishing': selected_furnishing,
        'Property_Type': selected_types,
        'Price_INR': prices
    })
    
    return df

if __name__ == '__main__':
    dataset_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(dataset_dir, 'house_prices.csv')
    
    print("Generating comprehensive realistic house prices dataset...")
    df = generate_house_prices_dataset(num_records=5000, random_seed=42)
    df.to_csv(csv_path, index=False)
    print(f"Successfully created dataset at: {csv_path}")
    print(f"Shape: {df.shape}")
    print("\nSample records:")
    print(df.head())
    print("\nDescriptive Statistics:")
    print(df.describe())
