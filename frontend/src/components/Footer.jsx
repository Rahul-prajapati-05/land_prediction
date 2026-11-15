import React from 'react';
import { Home, ArrowUp } from 'lucide-react';
import { api } from '../services/api';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--navy-primary)',
        color: '#f8fafc',
        padding: '60px 0 30px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '50px' }}>
          
          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--emerald-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Home size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                HomePrice <span style={{ color: '#34d399' }}>AI</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '16px' }}>
              Advanced multi-city Indian house price prediction powered by authentic Scikit-learn Linear Regression
              and interactive data science analytics.
            </p>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Designed for ML & Full-Stack Portfolio Showcase
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '16px' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><a href="#hero" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>Home Landing</a></li>
              <li><a href="#predictor" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>Price Predictor</a></li>
              <li><a href="#analytics" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>Analytics Dashboard</a></li>
              <li><a href="#history" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>Prediction History</a></li>
              <li><a href="#ml-guide" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>ML Guide & Theory</a></li>
            </ul>
          </div>

          {/* Col 3: Developer & Contact */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '16px' }}>Developer & Connect</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <a
                  href="https://github.com/Rahul-prajapati-05"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#34d399', fontWeight: '600' }}
                >
                  GitHub: @Rahul-prajapati-05
                </a>
              </li>
              <li>
                <a
                  href="mailto:rahulprajapati1480@gmail.com"
                  style={{ color: '#94a3b8' }}
                >
                  rahulprajapati1480@gmail.com
                </a>
              </li>
              <li>
                <a
                  href={api.getDatasetDownloadUrl()}
                  download
                  style={{ color: '#94a3b8' }}
                >
                  Download Dataset (5k CSV)
                </a>
              </li>
              <li><a href="#about" style={{ color: '#94a3b8' }}>Technology Stack</a></li>
            </ul>
          </div>

          {/* Col 4: Top Action */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '16px' }}>Back to Top</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '16px' }}>
              Calculate instant valuations for apartments, villas, and penthouses.
            </p>
            <button
              onClick={scrollToTop}
              className="btn"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '10px 16px',
                fontSize: '0.85rem',
              }}
            >
              <ArrowUp size={16} />
              <span>Scroll to Top</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '0.82rem',
            color: '#64748b',
          }}
        >
          <div>
            © {new Date().getFullYear()} HomePrice AI • Built with Python Flask, Scikit-learn, and React by <a href="https://github.com/Rahul-prajapati-05" target="_blank" rel="noreferrer" style={{ color: '#34d399', fontWeight: '600' }}>Rahul Prajapati</a>.
          </div>
          <div>
            100% Genuine Machine Learning Predictions • No Mocked Rates
          </div>
        </div>
      </div>
    </footer>
  );
}
