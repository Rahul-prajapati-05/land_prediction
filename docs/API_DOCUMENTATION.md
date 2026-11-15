# HomePrice AI - REST API Documentation

Base URL (Local): `http://127.0.0.1:5000`

All API endpoints return standard JSON responses and support Cross-Origin Resource Sharing (CORS).

---

## 1. Health Check
Checks backend service availability and Scikit-learn model loading status.

- **Method**: `GET`
- **Endpoint**: `/api/health`

### Response `200 OK`
```json
{
  "status": "healthy",
  "timestamp": "2026-11-15T12:00:00.000000",
  "model_loaded": true,
  "algorithm": "Linear Regression (Ordinary Least Squares)",
  "framework": "Scikit-learn",
  "version": "1.0.0"
}
```

---

## 2. Predict House Price
Submits 9 property attributes and receives the computed linear regression valuation, statistical confidence interval, unit rate per sq.ft, and city comparison.

- **Method**: `POST`
- **Endpoint**: `/api/predict`
- **Content-Type**: `application/json`

### Request Body Schema
| Field | Type | Description | Allowed Values / Bounds |
| :--- | :--- | :--- | :--- |
| `City` | string | Metropolitan location | Mumbai, Delhi, Bangalore, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad |
| `Area_sqft` | number | Super built-up carpet area | 200 - 20,000 sq.ft |
| `BHK` | integer | Bedroom, Hall, Kitchen count | 1 - 15 |
| `Bathrooms` | integer | Number of bathrooms | 1 - 15 |
| `Floors` | integer | Levels in property | 1 - 50 |
| `Property_Age` | integer | Construction age in years | 0 - 100 |
| `Parking` | string | Parking spot availability | `Yes`, `No` |
| `Furnishing` | string | Interior status | `Unfurnished`, `Semi-Furnished`, `Furnished` |
| `Property_Type`| string | Property classification | `Apartment`, `Independent House`, `Villa`, `Penthouse` |

### Sample Request
```json
{
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
```

### Sample Response `200 OK`
```json
{
  "success": true,
  "prediction_id": 14,
  "predicted_price": 15975789.24,
  "formatted_price": {
    "full": "₹1,59,75,789",
    "compact": "₹1.60 Cr",
    "combined": "₹1,59,75,789 (₹1.60 Cr)",
    "numeric": 15975789
  },
  "price_range": {
    "lower": 5378830.86,
    "upper": 26572747.62,
    "formatted_lower": { "compact": "₹53.79 Lakhs" },
    "formatted_upper": { "compact": "₹2.66 Cr" },
    "margin_percent": 66.3
  },
  "price_per_sqft": 9984.87,
  "formatted_price_per_sqft": "₹9,984.87 / sq.ft",
  "city_benchmark": {
    "city_avg": 17200000.0,
    "diff_percent": -7.1
  },
  "inputs": { ... },
  "timestamp": "2026-11-15 12:00:00"
}
```

---

## 3. Retrieve Prediction History
Fetches historical user valuation requests stored in SQLite.

- **Method**: `GET`
- **Endpoint**: `/api/history?limit=50`

### Sample Response `200 OK`
```json
{
  "success": true,
  "count": 1,
  "history": [
    {
      "id": 14,
      "timestamp": "2026-11-15 12:00:00",
      "city": "Bangalore",
      "area_sqft": 1600.0,
      "bhk": 3,
      "bathrooms": 3,
      "floors": 1,
      "property_age": 3,
      "parking": "Yes",
      "furnishing": "Semi-Furnished",
      "property_type": "Apartment",
      "predicted_price": 15975789.24,
      "price_lower": 5378830.86,
      "price_upper": 26572747.62,
      "formatted_price": "₹1,59,75,789 (₹1.60 Cr)"
    }
  ]
}
```

---

## 4. Delete Single Prediction
Removes a specific valuation record by its unique database primary key ID.

- **Method**: `DELETE`
- **Endpoint**: `/api/history/<record_id>`

### Sample Response `200 OK`
```json
{
  "success": true,
  "message": "Record 14 deleted."
}
```

---

## 5. Clear All Prediction History
Purges all historical records from the SQLite database.

- **Method**: `DELETE`
- **Endpoint**: `/api/history`

### Sample Response `200 OK`
```json
{
  "success": true,
  "message": "All prediction history cleared."
}
```

---

## 6. Retrieve Analytics & Model Coefficients
Returns comprehensive performance metrics (R², MAE, RMSE, MAPE), dataset statistics, and chart series for interactive dashboards.

- **Method**: `GET`
- **Endpoint**: `/api/analytics`

---

## 7. Download Training Dataset
Streams the verified 5,000-listing housing dataset directly as a CSV attachment.

- **Method**: `GET`
- **Endpoint**: `/api/download-dataset`
- **Content-Type**: `text/csv`
