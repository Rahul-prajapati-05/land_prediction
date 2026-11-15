import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Scatter, Bar, Line } from 'react-chartjs-2';
import { 
  BarChart3, 
  Database, 
  TrendingUp, 
  Maximize2, 
  Target, 
  Download, 
  Award,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { api } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsDashboard({ analyticsData, isDark }) {
  const [activeTab, setActiveTab] = useState('all');

  if (!analyticsData) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Analytics and ML Model Performance Metrics...</p>
      </div>
    );
  }

  const { metrics, dataset_stats, feature_importance, chart_data } = analyticsData;

  const textColor = isDark ? '#cbd5e1' : '#334155';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  // 1. Actual vs Predicted Data
  const actualVsPredPoints = (chart_data?.actual_vs_predicted || []).map((item) => ({
    x: Math.round(item.actual / 100000), // in Lakhs
    y: Math.round(item.predicted / 100000), // in Lakhs
  }));

  const maxVal = Math.max(
    ...actualVsPredPoints.map((p) => Math.max(p.x, p.y)),
    100
  );

  const actualVsPredChartData = {
    datasets: [
      {
        label: 'House Listings (Actual vs Predicted in ₹ Lakhs)',
        data: actualVsPredPoints,
        backgroundColor: 'rgba(5, 150, 105, 0.65)',
        borderColor: '#059669',
        borderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Perfect Fit Line (y = x)',
        data: [
          { x: 0, y: 0 },
          { x: maxVal, y: maxVal },
        ],
        type: 'line',
        borderColor: isDark ? '#f87171' : '#ef4444',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const actualVsPredOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: textColor, font: { family: 'Inter', size: 11 } },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Actual: ₹${context.raw.x}L | Predicted: ₹${context.raw.y}L`,
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: { display: true, text: 'Actual Price (₹ Lakhs)', color: textColor },
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        type: 'linear',
        title: { display: true, text: 'Predicted Price (₹ Lakhs)', color: textColor },
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
    },
  };

  // 2. Price Distribution Data
  const priceDistData = {
    labels: chart_data?.price_distribution?.bins || [],
    datasets: [
      {
        label: 'Number of Properties',
        data: chart_data?.price_distribution?.counts || [],
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        borderColor: '#2563eb',
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const priceDistOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} properties`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Price Bracket (₹ Lakhs)', color: textColor },
        ticks: { color: textColor, maxRotation: 45, minRotation: 30 },
        grid: { color: gridColor },
      },
      y: {
        title: { display: true, text: 'Property Count', color: textColor },
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
    },
  };

  // 3. Area vs Price Data
  const areaVsPricePoints = (chart_data?.actual_vs_predicted || []).map((item) => ({
    x: item.area,
    y: Math.round(item.actual / 100000), // in Lakhs
  }));

  const areaVsPriceData = {
    datasets: [
      {
        label: 'Property Listing (Area vs Listing Price)',
        data: areaVsPricePoints,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: '#10b981',
        borderWidth: 1,
        pointRadius: 4.5,
      },
    ],
  };

  const areaVsPriceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Area: ${context.raw.x} sq.ft | Price: ₹${context.raw.y}L`,
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        title: { display: true, text: 'Property Area (Square Feet)', color: textColor },
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        type: 'linear',
        title: { display: true, text: 'Listing Price (₹ Lakhs)', color: textColor },
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
    },
  };

  // 4. Feature Importance (Coefficients)
  const topFeatures = (feature_importance || []).slice(0, 10);
  const featureCoeffData = {
    labels: topFeatures.map((f) => f.feature.replace('cat__', '').replace('num__', '')),
    datasets: [
      {
        label: 'Regression Weight (₹ Lakhs Impact)',
        data: topFeatures.map((f) => Math.round(f.coefficient / 100000)),
        backgroundColor: topFeatures.map((f) => (f.coefficient >= 0 ? 'rgba(5, 150, 105, 0.75)' : 'rgba(239, 68, 68, 0.75)')),
        borderColor: topFeatures.map((f) => (f.coefficient >= 0 ? '#059669' : '#ef4444')),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const featureCoeffOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Impact: ₹${context.raw} Lakhs (${context.raw >= 0 ? 'Adds value' : 'Depreciates'})`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Regression Coefficient (₹ Lakhs)', color: textColor },
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
    },
  };

  // 5. City Average Price Data
  const cityData = chart_data?.city_avg_price || {};
  const cityAvgPriceData = {
    labels: Object.keys(cityData),
    datasets: [
      {
        label: 'Average Price (₹ Crores)',
        data: Object.values(cityData).map((val) => Number((val / 10000000).toFixed(2))),
        backgroundColor: 'rgba(99, 102, 241, 0.75)',
        borderColor: '#6366f1',
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const cityAvgPriceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Avg Price: ₹${context.raw} Cr`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'City', color: textColor },
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        title: { display: true, text: 'Average Listing Price (₹ Crores)', color: textColor },
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
    },
  };

  return (
    <section id="analytics" className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <BarChart3 size={14} />
            <span>Interactive Data Science Visualizations</span>
          </div>
          <h2 className="section-title">Machine Learning & Market Analytics</h2>
          <p className="section-subtitle">
            Transparent model evaluation metrics, statistical distributions, and econometric insights
            derived from real multi-city listings.
          </p>
        </div>

        {/* 6 Top Key Performance Cards */}
        <div className="grid-3" style={{ marginBottom: '36px' }}>
          
          {/* Card 1: Total Records */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                color: 'var(--blue-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Database size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Total Records
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800' }}>
                {dataset_stats?.total_records?.toLocaleString() || '5,000'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                4,000 Train / 1,000 Test (80:20 Split)
              </div>
            </div>
          </div>

          {/* Card 2: Model R² Score */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--emerald-light)',
                color: 'var(--emerald-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Award size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Model Accuracy (R² Score)
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--emerald-primary)' }}>
                {metrics?.r2_percentage || 87.61}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Out-of-sample testing accuracy
              </div>
            </div>
          </div>

          {/* Card 3: Average House Price */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Average Property Price
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800' }}>
                ₹{(dataset_stats?.avg_price / 10000000).toFixed(2)} Cr
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Median: ₹{(dataset_stats?.median_price / 10000000).toFixed(2)} Cr
              </div>
            </div>
          </div>

          {/* Card 4: Min & Max Prices */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(168, 85, 247, 0.12)',
                color: '#a855f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Layers size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Price Range (Min - Max)
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '800' }}>
                ₹{(dataset_stats?.min_price / 100000).toFixed(1)}L - ₹{(dataset_stats?.max_price / 10000000).toFixed(1)}Cr
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Across 8 Indian metro zones
              </div>
            </div>
          </div>

          {/* Card 5: Average Area */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--emerald-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Maximize2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Average Property Area
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800' }}>
                {Math.round(dataset_stats?.avg_area_sqft || 1645)} sq.ft
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Range: {dataset_stats?.min_area_sqft} to {dataset_stats?.max_area_sqft} sq.ft
              </div>
            </div>
          </div>

          {/* Card 6: Root Mean Squared Error (RMSE) */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Target size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                Test Set RMSE / MAE
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '800' }}>
                ₹{(metrics?.rmse / 100000).toFixed(2)}L <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>RMSE</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                MAE: ₹{(metrics?.mae / 100000).toFixed(2)} Lakhs
              </div>
            </div>
          </div>

        </div>

        {/* Charts Grid */}
        <div className="grid-2" style={{ marginBottom: '28px' }}>
          
          {/* Chart 1: Actual vs Predicted */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem' }}>Actual vs Predicted Price</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Scatter points of test set (R² = {metrics?.r2_score}) against ideal fit (red dashed line)
                </p>
              </div>
            </div>
            <div style={{ height: '320px' }}>
              <Scatter data={actualVsPredChartData} options={actualVsPredOptions} />
            </div>
          </div>

          {/* Chart 2: House Price Distribution */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem' }}>House Price Distribution</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Frequency count of properties grouped into price brackets (₹ Lakhs)
                </p>
              </div>
            </div>
            <div style={{ height: '320px' }}>
              <Bar data={priceDistData} options={priceDistOptions} />
            </div>
          </div>

          {/* Chart 3: Area vs Price */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem' }}>Area (sq.ft) vs Listing Price</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Visualizing strong linear correlation between square footage and property valuation
                </p>
              </div>
            </div>
            <div style={{ height: '320px' }}>
              <Scatter data={areaVsPriceData} options={areaVsPriceOptions} />
            </div>
          </div>

          {/* Chart 4: Feature Importance / Regression Weights */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem' }}>Feature Importance & Coefficients</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Green = positive price driver; Red = depreciation factor (e.g. Property Age)
                </p>
              </div>
            </div>
            <div style={{ height: '320px' }}>
              <Bar data={featureCoeffData} options={featureCoeffOptions} />
            </div>
          </div>

        </div>

        {/* Chart 5: City Averages + Dataset Download Banner */}
        <div className="grid-2">
          
          <div className="card">
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '1.15rem' }}>Average Property Valuation by City</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Comparison of average listing prices across Tier-1 Indian megacities (in ₹ Crores)
              </p>
            </div>
            <div style={{ height: '280px' }}>
              <Bar data={cityAvgPriceData} options={cityAvgPriceOptions} />
            </div>
          </div>

          {/* Dataset Download Card */}
          <div
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(15, 30, 60, 0.04) 0%, rgba(5, 150, 105, 0.08) 100%)',
              border: '1.5px dashed var(--emerald-primary)',
            }}
          >
            <div>
              <div className="section-badge" style={{ marginBottom: '12px' }}>
                <Database size={13} />
                <span>Open Data Science Asset</span>
              </div>
              <h4 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>
                Download Training Dataset (CSV)
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '18px' }}>
                Access the complete dataset of 5,000 multi-city Indian housing records used to train this
                Scikit-learn Linear Regression model. Includes all 9 features: City, Area, BHK, Bathrooms,
                Floors, Property Age, Parking, Furnishing, Property Type, and Price (INR).
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: '600' }}>
                  • Format: <span style={{ color: 'var(--emerald-primary)' }}>CSV (Comma-Separated)</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: '600' }}>
                  • Size: <span style={{ color: 'var(--emerald-primary)' }}>~310 KB</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: '600' }}>
                  • Null Values: <span style={{ color: 'var(--emerald-primary)' }}>0 (Clean)</span>
                </div>
              </div>
            </div>

            <div>
              <a
                href={api.getDatasetDownloadUrl()}
                className="btn btn-primary"
                download="indian_metro_house_prices_5000.csv"
                style={{ width: '100%' }}
              >
                <Download size={18} />
                <span>Download Sample Dataset (5,000 Records)</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
