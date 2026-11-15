# Dataset Documentation: Indian Metro Housing Market (5,000 Records)

## 1. Overview & Source
- **Dataset File**: `dataset/house_prices.csv`
- **Total Records**: 5,000 listings
- **Features**: 9 independent variables (predictors), 1 continuous target variable (`Price_INR`)
- **Geographic Coverage**: 8 major Tier-1 and metropolitan tech/commercial hubs across India:
  - Mumbai (Financial capital, western zone)
  - Delhi NCR (National capital region, northern zone)
  - Bangalore (Silicon Valley of India, southern zone)
  - Hyderabad (Technology & biotechnology hub, southern zone)
  - Pune (Automobile & software corridor, western zone)
  - Chennai (Industrial & manufacturing corridor, southern zone)
  - Kolkata (Eastern cultural & commerce center)
  - Ahmedabad (Textile & manufacturing center, western zone)

## 2. Feature Schema & Data Dictionary

| Column Name | Type | Description | Values / Range |
| :--- | :--- | :--- | :--- |
| `City` | Categorical (String) | Metro city where property is situated | Mumbai, Delhi, Bangalore, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad |
| `Area_sqft` | Numerical (Integer) | Total carpet / super built-up area in square feet | 420 - 6,000 sq ft |
| `BHK` | Numerical (Integer) | Bedroom, Hall, Kitchen count | 1, 2, 3, 4, 5 BHK |
| `Bathrooms` | Numerical (Integer) | Total number of bathrooms | 1 - 5 |
| `Floors` | Numerical (Integer) | Number of levels/floors in property | 1 - 4 |
| `Property_Age`| Numerical (Integer) | Age of structure since construction (years) | 0 - 35 years (0 = brand new) |
| `Parking` | Categorical (String) | Dedicated parking space availability | `Yes`, `No` |
| `Furnishing` | Categorical (String) | Interior furnishing state | `Unfurnished`, `Semi-Furnished`, `Furnished` |
| `Property_Type`| Categorical (String) | Architectural property classification | `Apartment`, `Independent House`, `Villa`, `Penthouse` |
| `Price_INR` | Numerical (Integer) | **Target Variable**: Fair market listing price in ₹ | ₹21,10,000 to ₹15,36,70,000 |

## 3. Data Cleansing & Preprocessing Pipeline
1. **Missing Value Checks**: Verified zero null / NaN values across all 5,000 rows.
2. **Feature Encoding**:
   - `OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore')` applied to categorical features (`City`, `Parking`, `Furnishing`, `Property_Type`).
3. **Feature Scaling**:
   - `StandardScaler()` applied to numerical features (`Area_sqft`, `BHK`, `Bathrooms`, `Floors`, `Property_Age`) within a unified Scikit-learn `Pipeline`.
4. **Data Partitioning**:
   - 80% Training Set (4,000 samples)
   - 20% Testing Set (1,000 samples)
   - Fixed `random_state=42` for 100% scientific reproducibility.
