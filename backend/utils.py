"""
Utility functions for currency formatting (₹ Lakhs & Crores),
prediction intervals, and input validation.
"""

def format_inr(amount):
    """
    Formats a numeric value into standard Indian numbering system with ₹ symbol,
    along with compact Lakhs/Crores representation.
    Example: 12500000 -> "₹1,25,00,000 (₹1.25 Cr)"
    """
    if amount is None:
        return "₹0"
    
    val = round(float(amount))
    sign = "-" if val < 0 else ""
    abs_val = abs(val)
    
    # Format according to Indian comma grouping (last 3 digits, then pairs of 2 digits)
    s = str(abs_val)
    if len(s) <= 3:
        formatted_raw = s
    else:
        last_three = s[-3:]
        remaining = s[:-3]
        # split remaining into chunks of 2 from right to left
        groups = []
        while len(remaining) > 2:
            groups.insert(0, remaining[-2:])
            remaining = remaining[:-2]
        if remaining:
            groups.insert(0, remaining)
        formatted_raw = ",".join(groups) + "," + last_three
        
    full_str = f"{sign}₹{formatted_raw}"
    
    # Compact denomination
    if abs_val >= 10000000:
        cr = abs_val / 10000000.0
        compact = f"₹{cr:.2f} Cr"
    elif abs_val >= 100000:
        lakh = abs_val / 100000.0
        compact = f"₹{lakh:.2f} Lakhs"
    elif abs_val >= 1000:
        k = abs_val / 1000.0
        compact = f"₹{k:.1f} K"
    else:
        compact = full_str
        
    return {
        'full': full_str,
        'compact': compact,
        'combined': f"{full_str} ({compact})" if abs_val >= 100000 else full_str,
        'numeric': val
    }

def calculate_prediction_interval(predicted_price, rmse, confidence=0.90):
    """
    Calculates statistical estimate interval based on model Root Mean Squared Error (RMSE).
    Confidence factor:
    - 0.90 ~ 1.645 * RMSE
    - 0.80 ~ 1.28 * RMSE
    Ensures lower bound never drops below minimum realistic valuation.
    """
    z_score = 1.645 if confidence >= 0.90 else 1.28
    margin = z_score * rmse
    
    lower = max(1000000.0, predicted_price - margin)
    upper = predicted_price + margin
    
    return {
        'lower': lower,
        'upper': upper,
        'formatted_lower': format_inr(lower),
        'formatted_upper': format_inr(upper),
        'margin_percent': round((margin / predicted_price) * 100, 1) if predicted_price > 0 else 0
    }

def validate_prediction_input(data):
    """
    Validates payload against domain bounds and types.
    Returns (is_valid, error_message, cleaned_dict)
    """
    required_fields = [
        'City', 'Area_sqft', 'BHK', 'Bathrooms', 
        'Floors', 'Property_Age', 'Parking', 
        'Furnishing', 'Property_Type'
    ]
    
    if not isinstance(data, dict):
        return False, "Request body must be a valid JSON object.", None
        
    for field in required_fields:
        if field not in data or data[field] is None or str(data[field]).strip() == "":
            return False, f"Missing required field: '{field}'", None
            
    # Type & Range validation
    try:
        area = float(data['Area_sqft'])
        if area < 200 or area > 20000:
            return False, "Area (Square Feet) must be between 200 and 20,000 sq ft.", None
    except ValueError:
        return False, "Area_sqft must be a valid number.", None
        
    try:
        bhk = int(data['BHK'])
        if bhk < 1 or bhk > 15:
            return False, "BHK must be an integer between 1 and 15.", None
    except ValueError:
        return False, "BHK must be an integer.", None
        
    try:
        bathrooms = int(data['Bathrooms'])
        if bathrooms < 1 or bathrooms > 15:
            return False, "Bathrooms must be an integer between 1 and 15.", None
    except ValueError:
        return False, "Bathrooms must be an integer.", None
        
    try:
        floors = int(data['Floors'])
        if floors < 1 or floors > 50:
            return False, "Floors must be an integer between 1 and 50.", None
    except ValueError:
        return False, "Floors must be an integer.", None
        
    try:
        age = int(data['Property_Age'])
        if age < 0 or age > 100:
            return False, "Property Age must be between 0 and 100 years.", None
    except ValueError:
        return False, "Property_Age must be a valid integer.", None
        
    parking = str(data['Parking']).strip().title()
    if parking not in ['Yes', 'No']:
        return False, "Parking must be either 'Yes' or 'No'.", None
        
    furnishing = str(data['Furnishing']).strip().title()
    valid_furnishing = ['Unfurnished', 'Semi-Furnished', 'Furnished']
    if furnishing not in valid_furnishing:
        return False, f"Furnishing must be one of {valid_furnishing}", None
        
    property_type = str(data['Property_Type']).strip().title()
    valid_types = ['Apartment', 'Independent House', 'Villa', 'Penthouse']
    if property_type not in valid_types:
        return False, f"Property_Type must be one of {valid_types}", None
        
    city = str(data['City']).strip().title()
    
    cleaned = {
        'City': city,
        'Area_sqft': area,
        'BHK': bhk,
        'Bathrooms': bathrooms,
        'Floors': floors,
        'Property_Age': age,
        'Parking': parking,
        'Furnishing': furnishing,
        'Property_Type': property_type
    }
    
    return True, None, cleaned
