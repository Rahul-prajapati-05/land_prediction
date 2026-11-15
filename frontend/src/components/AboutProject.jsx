import React from 'react';
import { 
  Info, 
  Code2, 
  Server, 
  BrainCircuit, 
  Database, 
  CheckCircle, 
  ExternalLink 
} from 'lucide-react';

export default function AboutProject() {
  const stackItems = [
    {
      category: 'Frontend Client',
      tech: 'React.js 18 + Vite',
      desc: 'Modern SPA featuring dynamic theming (Light/Dark), responsive layout, interactive Chart.js visualizations, and instant jsPDF report generation.',
      icon: Code2,
      color: '#3b82f6',
      tags: ['React', 'Chart.js', 'jsPDF', 'Vite', 'Lucide']
    },
    {
      category: 'Backend Microservice',
      tech: 'Python Flask REST API',
      desc: 'Lightweight REST server handling endpoint routing, payload schema validation, model inference orchestration, and cross-origin resource sharing.',
      icon: Server,
      color: '#059669',
      tags: ['Flask', 'Flask-CORS', 'Python 3.13', 'WSGI']
    },
    {
      category: 'Machine Learning Pipeline',
      tech: 'Scikit-learn & Joblib',
      desc: 'Authentic Multiple Linear Regression pipeline with StandardScaler, OneHotEncoder ColumnTransformer, and 87.61% test set R² score.',
      icon: BrainCircuit,
      color: '#8b5cf6',
      tags: ['Scikit-learn', 'Pandas', 'NumPy', 'Joblib']
    },
    {
      category: 'Database & Persistence',
      tech: 'SQLite Architecture',
      desc: 'Embedded relational database for historical prediction auditing, recording timestamps, 9 property features, and valuation bounds.',
      icon: Database,
      color: '#f59e0b',
      tags: ['SQLite3', 'ACID Transactions', 'SQL Schema']
    }
  ];

  return (
    <section id="about" className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <div className="section-badge">
            <Info size={14} />
            <span>Architecture & Specifications</span>
          </div>
          <h2 className="section-title">About HomePrice AI</h2>
          <p className="section-subtitle">
            An industry-grade Data Science & Machine Learning full-stack application built for real-world
            predictive modeling and executive portfolio demonstration.
          </p>
        </div>

        {/* 4 Tech Stack Pillars */}
        <div className="grid-2" style={{ marginBottom: '36px' }}>
          {stackItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                      {item.category}
                    </div>
                    <h3 style={{ fontSize: '1.2rem' }}>{item.tech}</h3>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                  {item.desc}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        backgroundColor: 'var(--bg-card-subtle)',
                        color: 'var(--text-main)',
                        fontWeight: '500',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Engineering Highlights Banner */}
        <div
          className="card"
          style={{
            padding: '32px',
            background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-subtle) 100%)',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>
            Production & Engineering Highlights
          </h3>

          <div className="grid-3" style={{ gap: '18px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <CheckCircle size={18} color="var(--emerald-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>100% Authentic ML:</strong> Zero hardcoded or random price guesses. Every single rupee is derived from linear regression weights.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <CheckCircle size={18} color="var(--emerald-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Robust Error Handling:</strong> Gracefully manages unseen categories and invalid form submissions with comprehensive validation.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <CheckCircle size={18} color="var(--emerald-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Self-Contained Deployment:</strong> Easily packaged for local testing or cloud deployment (Docker, Render, Railway, AWS).
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
