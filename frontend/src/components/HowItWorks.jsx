import React from 'react';
import { 
  SlidersHorizontal, 
  Workflow, 
  Cpu, 
  FileCheck2, 
  ArrowRight 
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Property Specifications',
      desc: 'Enter 9 core attributes including city location, square footage, BHK count, bathrooms, age, and furnishing.',
      icon: SlidersHorizontal,
      color: '#3b82f6',
    },
    {
      num: '02',
      title: 'Scikit-learn Pipeline',
      desc: 'Numerical variables are standardized; categorical variables are one-hot encoded with unseen-category safety.',
      icon: Workflow,
      color: '#8b5cf6',
    },
    {
      num: '03',
      title: 'Linear Regression Engine',
      desc: 'The trained OLS regression model computes the weighted dot product with empirical coefficients in <20ms.',
      icon: Cpu,
      color: '#059669',
    },
    {
      num: '04',
      title: 'Valuation & PDF Report',
      desc: 'Instant delivery of fair market price in ₹ (Lakhs/Crores), 90% statistical range, rate/sq.ft, and downloadable PDF.',
      icon: FileCheck2,
      color: '#f59e0b',
    },
  ];

  return (
    <section className="section">
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <div className="section-badge">
            <Workflow size={14} />
            <span>Algorithmic Workflow</span>
          </div>
          <h2 className="section-title">How HomePrice AI Works</h2>
          <p className="section-subtitle">
            From raw real estate specifications to statistical appraisal in four automated stages.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid-4" style={{ position: 'relative' }}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: `${step.color}18`,
                        color: step.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <span
                      style={{
                        fontSize: '1.4rem',
                        fontWeight: '800',
                        color: 'var(--text-subtle)',
                        opacity: 0.5,
                      }}
                    >
                      {step.num}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {step.desc}
                  </p>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: step.color, fontSize: '0.8rem', fontWeight: '600' }}>
                  <span>Stage {idx + 1}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
