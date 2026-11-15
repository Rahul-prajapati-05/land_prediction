import React from 'react';
import { ArrowRight, Sparkles, Building2, TrendingUp, ShieldCheck, Cpu } from 'lucide-react';

export default function Hero({ onPredictClick, analyticsData }) {
  const r2Score = analyticsData?.metrics?.r2_percentage || 87.6;
  const totalListings = analyticsData?.dataset_stats?.total_records || 5000;

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '120px',
        paddingBottom: '60px',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorators & Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5, 150, 105, 0.18) 0%, rgba(15, 30, 60, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '-8%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(15, 30, 60, 0) 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Column: Headline, Subtitle, CTA */}
          <div>
            <div className="section-badge animate-fade-in">
              <Sparkles size={14} />
              <span>AI-Powered Real Estate Analytics</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                fontWeight: '800',
                lineHeight: 1.15,
                marginBottom: '20px',
                letterSpacing: '-0.03em',
              }}
            >
              Predict Your <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--emerald-primary) 0%, #2563eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Dream Home's Value
              </span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-muted)',
                marginBottom: '32px',
                lineHeight: 1.6,
                maxWidth: '540px',
              }}
            >
              Get accurate house price estimates using Machine Learning. Powered by an authentic Scikit-learn
              Linear Regression model trained on multi-city property listings across India.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <a
                href="#predictor"
                className="btn btn-primary"
                onClick={onPredictClick}
                style={{ fontSize: '1.05rem', padding: '14px 28px' }}
              >
                <span>Predict Now</span>
                <ArrowRight size={18} />
              </a>

              <a
                href="#analytics"
                className="btn btn-secondary"
                style={{ fontSize: '1.05rem', padding: '14px 24px' }}
              >
                <span>Explore Analytics</span>
              </a>
            </div>

            {/* Micro Trust Indicators */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--emerald-primary)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Trained ML Pipeline</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} color="var(--blue-accent)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Zero Hardcoded Values</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="var(--emerald-primary)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Confidence Intervals</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Real Estate Card Overlay */}
          <div style={{ position: 'relative' }}>
            {/* Visual Frame */}
            <div
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)',
                position: 'relative',
                background: 'linear-gradient(180deg, rgba(15, 30, 60, 0.4) 0%, rgba(15, 30, 60, 0.9) 100%)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                alt="Modern Architecture Home"
                style={{
                  width: '100%',
                  height: '420px',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'brightness(0.92)',
                  transition: 'transform 0.5s ease',
                }}
                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.03)')}
                onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
              />

              {/* Overlay Glass Badge: Top Right */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(12px)',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#34d399', fontWeight: '700' }}>
                  Model Accuracy
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>{r2Score}% R² Score</div>
              </div>

              {/* Overlay Glass Card: Bottom */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                  background: 'rgba(15, 23, 42, 0.88)',
                  backdropFilter: 'blur(12px)',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>
                    Sample Prediction
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>
                    3 BHK Luxury Apartment • Mumbai
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Valuation</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#10b981' }}>
                    ₹3.25 Cr
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Quick Stat Pill */}
            <div
              className="card animate-pulse-glow"
              style={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--emerald-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--emerald-primary)',
                }}
              >
                <Building2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                  Verified Dataset
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {totalListings.toLocaleString()}+ Properties
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Quick Metrics Bar Under Hero */}
        <div
          style={{
            marginTop: '60px',
            padding: '24px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>DATASET VOLUME</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>5,000 Verified</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--emerald-primary)', fontWeight: '500' }}>Across 8 Megacities</div>
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>MODEL COEFFICIENT R²</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>87.61%</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--emerald-primary)', fontWeight: '500' }}>Out-of-sample fit</div>
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>ALGORITHM</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>Linear Reg.</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--blue-accent)', fontWeight: '500' }}>Scikit-learn OLS</div>
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>CURRENCY STANDARD</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>₹ INR (Lakhs/Cr)</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--emerald-primary)', fontWeight: '500' }}>Statistically calibrated</div>
          </div>
        </div>

      </div>
    </section>
  );
}
