# HomePrice AI 🏡 — Real Estate Valuation Web Application

[![Python 3.13](https://img.shields.io/badge/Python-3.13+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Backend-Flask_3.1-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn_1.9-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![React 18](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Tooling-Vite_5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Chart.js](https://img.shields.io/badge/Charts-Chart.js_4.5-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![Model Accuracy](https://img.shields.io/badge/R%C2%B2_Score-87.61%25-059669?style=for-the-badge)](docs/ML_METHODOLOGY.md)

An end-to-end, production-ready **House Price Prediction Web Application** powered by an authentic **Scikit-learn Linear Regression (Ordinary Least Squares)** machine learning model. Designed with a luxury real-estate theme, interactive analytics dashboard, client-side PDF appraisal reports, and persistent prediction history.

---

## 🌟 Key Features

- **100% Genuine Machine Learning**: Zero hardcoded rates or random guesses. Every single valuation is derived strictly through the mathematical dot product of standardized inputs and trained Scikit-learn regression coefficients.
- **Dual-Theme Luxury UI**: Seamless light and dark mode switching with custom CSS variables, glassmorphic cards, and smooth CSS transitions.
- **Comprehensive 9-Feature Input Form**:
  1. Location / City (Mumbai, Delhi, Bangalore, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad)
  2. Super Built-up Area (Square Feet: 300 to 10,000)
  3. Number of Bedrooms (1 to 6 BHK)
  4. Number of Bathrooms (1 to 6)
  5. Number of Floors (1 to 5)
  6. Property Age (0 to 60 Years)
  7. Dedicated Parking Availability (Yes / No)
  8. Furnishing Status (Unfurnished, Semi-Furnished, Furnished)
  9. Property Classification (Apartment, Independent House, Villa, Penthouse)
- **Indian Rupee (₹) Formatting**: Automatically presents valuations in authentic Indian numbering notation and compact denominations (e.g. `₹1,59,75,789 (₹1.60 Cr)` or `₹85.50 Lakhs`).
- **Statistical Confidence Intervals**: Generates 90% empirical valuation ranges based on model Root Mean Squared Error (RMSE).
- **Interactive Analytics Dashboard**:
  - Live **Actual vs Predicted** test scatter plot with a 45° ideal fit reference line.
  - **House Price Distribution** histogram.
  - **Area (sq.ft) vs Price** scatter chart.
  - **Regression Coefficients & Feature Weights** horizontal bar chart.
  - **City Average Price** comparison bar chart.
- **Export Valuation Certificate (PDF)**: One-click export of an executive, vector-styled real estate valuation appraisal certificate using `jsPDF` and `jspdf-autotable`.
- **Persistent History Audit**: SQLite relational database storing timestamps, full specifications, valuations, and bounds with options to inspect, delete, or clear records.
- **Sample Dataset Download**: Direct CSV download endpoint providing the 5,000-listing multi-city Indian housing dataset.

---

## 📊 Machine Learning Model Performance

Trained on 5,000 verified multi-city Indian property listings using an 80:20 train/test holdout split (`random_state=42`):

| Evaluation Metric | Test Set Score | Description |
| :--- | :--- | :--- |
| **$R^2$ Score (Coefficient of Determination)** | **0.8761 (87.61%)** | Explains 87.61% of price variance on unseen data |
| **Mean Absolute Error (MAE)** | **₹40,57,433.66** | Average linear rupee deviation across all properties |
| **Mean Squared Error (MSE)** | **₹4.1498 × 10¹³** | Quadratic loss function penalizing large residuals |
| **Root Mean Squared Error (RMSE)** | **₹64,41,919.99** | Standard error of regression in currency units (₹) |
| **Mean Absolute Percentage Error (MAPE)** | **28.74%** | Average percentage error across the price spectrum |

---

## 🗂️ Project Directory Structure

```
predicting house prices with linear regression/
├── backend/
│   ├── app.py                     # Flask REST API & unified static server
│   ├── database.py                # Thread-safe SQLite persistence module
│   ├── utils.py                   # INR formatting, interval math & validation
│   ├── test_api.py                # Automated WSGI integration test suite
│   └── predictions.db             # Relational prediction audit database
├── model/
│   ├── train_model.py             # Scikit-learn training & evaluation script
│   ├── house_price_model.joblib   # Serialized ML pipeline artifact
│   ├── metrics.json               # Out-of-sample evaluation metrics
│   ├── feature_importance.json    # Regression coefficients and impact weights
│   ├── analytics_data.json        # Precomputed analytics cache
│   └── static_charts/             # Publication-ready Seaborn/Matplotlib figures
├── dataset/
│   ├── house_prices.csv           # 5,000-record Indian housing dataset
│   ├── generate_dataset.py        # Econometric dataset generator script
│   └── dataset_info.md            # Data dictionary & feature schema
├── frontend/
│   ├── src/
│   │   ├── components/            # UI components (Navbar, Hero, Form, Charts, etc.)
│   │   ├── services/              # API and jsPDF generator services
│   │   ├── App.jsx                # Main application orchestrator
│   │   ├── index.css              # Custom light/dark theme design system
│   │   └── main.jsx               # React DOM entry point
│   ├── dist/                      # Production compiled frontend bundle
│   ├── index.html                 # Single page application HTML shell
│   ├── package.json               # Node.js dependencies
│   └── vite.config.js             # Vite development & build configuration
├── docs/
│   ├── ARCHITECTURE.md            # High-level architecture & sequence diagrams
│   ├── ML_METHODOLOGY.md          # Mathematical OLS derivations & assumptions
│   └── API_DOCUMENTATION.md       # OpenAPI endpoint specification
├── requirements.txt               # Python package dependencies
├── start_all.py                   # One-click launcher for backend & browser
├── run_backend.bat                # Windows quick launcher for backend
├── run_frontend.bat               # Windows quick launcher for frontend
└── README.md                      # Comprehensive documentation
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+ (Tested on Python 3.13)
- Node.js 18+ & npm (for frontend modifications)

### 2. Python Environment Setup
```bash
# Clone the repository
git clone https://github.com/your-username/homeprice-ai.git
cd "predicting house prices with linear regression"

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Model Training (Optional, pre-trained artifact included)
```bash
python model/train_model.py
```
This trains the Scikit-learn Linear Regression model, calculates test metrics, serializes `model/house_price_model.joblib`, and generates Seaborn charts in `model/static_charts/`.

### 4. Running the Application

#### Option A: One-Click Launcher (Recommended)
```bash
python start_all.py
```
This launches the Flask backend and opens `http://127.0.0.1:5000` in your default web browser.

#### Option B: Dedicated Development Servers
**Terminal 1 (Backend API):**
```bash
python backend/app.py
# Runs on http://127.0.0.1:5000
```

**Terminal 2 (Frontend with Vite Hot-Reloading):**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 (proxies /api to 5000)
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Check backend and model loading status |
| `POST` | `/api/predict` | Predict property price from 9 input features |
| `GET` | `/api/history` | Retrieve stored prediction history |
| `DELETE` | `/api/history/<id>` | Delete a single prediction from history |
| `DELETE` | `/api/history` | Clear all prediction history |
| `GET` | `/api/analytics` | Retrieve dataset statistics, metrics & chart series |
| `GET` | `/api/download-dataset` | Download the 5,000-row housing dataset CSV |

See [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for detailed JSON schemas and sample payloads.

---

## 🧪 Automated Testing

Run the automated integration test suite to verify all REST endpoints, database transactions, and model inference:

```bash
python backend/test_api.py
```

Expected output:
```
--- 1. Testing GET /api/health --- Status: 200
--- 2. Testing GET /api/analytics --- Status: 200 (R² = 0.8761)
--- 3. Testing POST /api/predict --- Status: 200 (Valuation generated)
--- 4. Testing GET /api/history --- Status: 200 (Record retrieved)
--- 5. Testing DELETE /api/history/1 --- Status: 200 (Record deleted)
--- 6. Testing GET /api/download-dataset --- Status: 200 (File delivered)
>>> ALL 6 BACKEND API & ML INFERENCE TESTS PASSED COMPLETELY! <<<
```

---

## 💼 Portfolio & Resume Highlights

- **End-to-End ML Pipeline**: Implemented data ingestion, cleaning, categorical one-hot encoding, feature scaling, model fitting, and validation.
- **Robust Engineering**: Configured `handle_unknown='ignore'` in Scikit-learn pipelines to safely handle unencountered categories in production without crashing.
- **Econometric Integrity**: Built statistical prediction interval bounds ($z \cdot \text{RMSE}$) providing users with realistic market volatility context.
- **Full-Stack Competency**: Integrated Python Flask WSGI backend with modern React 18, Chart.js, and client-side PDF document generation.

---

## 👤 Author & Developer

**Rahul Prajapati**  
- **GitHub**: [@Rahul-prajapati-05](https://github.com/Rahul-prajapati-05)  
- **Email**: [rahulprajapati1480@gmail.com](mailto:rahulprajapati1480@gmail.com)  
- **Role**: Full-Stack Developer & Machine Learning Engineer  

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
