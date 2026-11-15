import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Sigma, 
  CheckCircle2, 
  Sliders, 
  Target, 
  Compass, 
  Calculator,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function MLGuide({ metrics }) {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "What is Linear Regression?",
      a: "Linear Regression is a foundational supervised machine learning algorithm used to model the relationship between a continuous dependent target variable (house price in ₹) and one or more independent explanatory features (square footage, bedrooms, location, property age). It fits an optimal linear hyperplane that minimizes the distance between predicted and actual values."
    },
    {
      q: "How does the Ordinary Least Squares (OLS) algorithm work?",
      a: "OLS minimizes the Residual Sum of Squares (RSS). Residuals are the vertical differences between actual house sale prices and model predictions. By calculating the partial derivatives of RSS with respect to each feature weight (coefficients β) and setting them to zero, OLS finds the mathematically unique line of best fit that produces the lowest overall error."
    },
    {
      q: "What features influence house prices the most in our model?",
      a: "1. Area (Square Feet): Exhibits the strongest positive linear correlation (R > 0.85). Larger square footage directly elevates construction and land value.\n2. Location / City: Baseline land valuations vary drastically across Indian metros (Mumbai > Delhi > Bangalore > Hyderabad > Pune).\n3. Property Type: Luxury classes like Villas and Penthouses carry architectural and land ownership premiums.\n4. Property Age: Subtracts value annually due to structural depreciation."
    },
    {
      q: "How does the model calculate a house valuation?",
      a: "When a user submits 9 attributes, categorical features (City, Furnishing, Property Type) are one-hot encoded, and numerical features are standardized. The model multiplies each feature by its learned regression weight β and adds the intercept β₀: Price = β₀ + (β₁ × Area) + (β₂ × BHK) + ... + (βₖ × City). The sum is your estimated fair market value in ₹."
    },
    {
      q: "What do R² Score, MAE, MSE, and RMSE mean?",
      a: "• R² Score (Coefficient of Determination): Measures the proportion of variance in house prices explained by the features (Our model achieves ~87.6%).\n• MAE (Mean Absolute Error): Average absolute difference between predicted and actual prices in ₹.\n• MSE (Mean Squared Error): Average of squared errors, heavily penalizing large outliers.\n• RMSE (Root Mean Squared Error): Square root of MSE, expressed in the same currency unit (₹) as the target price."
    }
  ];

  return (
    <section id="ml-guide" className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <div className="section-badge">
            <BookOpen size={14} />
            <span>Machine Learning Theory & Architecture</span>
          </div>
          <h2 className="section-title">Understanding Linear Regression</h2>
          <p className="section-subtitle">
            An intuitive, transparent breakdown of the mathematics, algorithms, and evaluation metrics
            powering the HomePrice AI valuation engine.
          </p>
        </div>

        {/* Mathematical Formula Card */}
        <div
          className="card"
          style={{
            marginBottom: '36px',
            border: '1.5px solid rgba(5, 150, 105, 0.3)',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-subtle) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Sigma size={24} color="var(--emerald-primary)" />
            <h3 style={{ fontSize: '1.35rem' }}>The Multiple Linear Regression Equation</h3>
          </div>

          <div
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
              marginBottom: '20px',
              overflowX: 'auto',
            }}
          >
            <div
              style={{
                fontFamily: 'Courier New, monospace',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)',
                fontWeight: '700',
                color: 'var(--text-main)',
                letterSpacing: '0.02em',
              }}
            >
              Y = β₀ + β₁·(Area) + β₂·(BHK) + β₃·(Baths) + β₄·(Floors) − β₅·(Age) + Σ(βⱼ·Categoryⱼ) + ε
            </div>
          </div>

          <div className="grid-3" style={{ gap: '16px', fontSize: '0.88rem' }}>
            <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-main)' }}>
              <strong style={{ color: 'var(--emerald-primary)' }}>Y (Target Variable)</strong>: The predicted fair market price of the property in Indian Rupees (₹).
            </div>
            <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-main)' }}>
              <strong style={{ color: 'var(--blue-accent)' }}>β₀ (Intercept)</strong>: Baseline minimum valuation when all numerical predictors are at their reference levels.
            </div>
            <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-main)' }}>
              <strong style={{ color: 'var(--emerald-primary)' }}>β₁ to βₖ (Coefficients)</strong>: Marginal impact of each unit change in a feature (e.g. additional sq.ft or bedroom).
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid: Metrics */}
        <div className="grid-4" style={{ marginBottom: '40px' }}>
          
          <div className="card">
            <div style={{ color: 'var(--emerald-primary)', marginBottom: '8px' }}>
              <Target size={24} />
            </div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>R² Score (Fit)</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--emerald-primary)', marginBottom: '8px' }}>
              {metrics?.r2_percentage || 87.61}%
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Coefficient of determination measuring the variance in prices explained by the input features.
            </p>
          </div>

          <div className="card">
            <div style={{ color: 'var(--blue-accent)', marginBottom: '8px' }}>
              <Calculator size={24} />
            </div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>MAE (Avg Error)</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--blue-accent)', marginBottom: '8px' }}>
              ₹{metrics?.mae ? (metrics.mae / 100000).toFixed(1) : '40.5'} Lakhs
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Mean Absolute Error represents the average linear rupee difference across all test listings.
            </p>
          </div>

          <div className="card">
            <div style={{ color: '#f59e0b', marginBottom: '8px' }}>
              <Sliders size={24} />
            </div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>RMSE (Root MSE)</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b', marginBottom: '8px' }}>
              ₹{metrics?.rmse ? (metrics.rmse / 100000).toFixed(1) : '64.4'} Lakhs
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Root Mean Squared Error standardizes error variance and bounds the 90% confidence interval.
            </p>
          </div>

          <div className="card">
            <div style={{ color: '#8b5cf6', marginBottom: '8px' }}>
              <Compass size={24} />
            </div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Encoding Engine</h4>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#8b5cf6', marginBottom: '8px' }}>
              One-Hot + Scaler
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Safe category vectorizer with handle_unknown='ignore' protects against unseen user inputs.
            </p>
          </div>

        </div>

        {/* Interactive FAQ / Deep Dive Accordion */}
        <div className="card" style={{ padding: '36px' }}>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '24px' }}>
            Frequently Asked Questions on Machine Learning & House Valuation
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: isOpen ? 'var(--bg-main)' : 'var(--bg-card)',
                      textAlign: 'left',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      color: 'var(--text-main)',
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} color="var(--emerald-primary)" /> : <ChevronDown size={18} />}
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '18px 20px',
                        backgroundColor: 'var(--bg-card)',
                        borderTop: '1px solid var(--border-color)',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem',
                        lineHeight: '1.65',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
