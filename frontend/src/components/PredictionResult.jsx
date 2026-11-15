import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  Download, 
  TrendingUp, 
  Building, 
  MapPin, 
  Maximize2, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Share2 
} from 'lucide-react';
import { generateValuationPDF } from '../services/pdfGenerator';

export default function PredictionResult({ result, onReset }) {
  useEffect(() => {
    if (result) {
      // Fire confetti burst for celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#059669', '#10b981', '#3b82f6', '#f59e0b']
        });
      } catch (err) {
        // Safe fallback
      }
    }
  }, [result]);

  if (!result) return null;

  const {
    formatted_price,
    price_range,
    price_per_sqft,
    formatted_price_per_sqft,
    city_benchmark,
    inputs,
    prediction_id,
    timestamp
  } = result;

  const handleDownloadPDF = () => {
    generateValuationPDF(result);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'HomePrice AI Property Valuation',
        text: `Valuation for ${inputs.BHK} BHK ${inputs.Property_Type} in ${inputs.City}: ${formatted_price.combined}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `HomePrice AI Valuation for ${inputs.BHK} BHK ${inputs.Property_Type} in ${inputs.City}: ${formatted_price.combined} (${formatted_price_per_sqft})`
      );
      alert('Valuation details copied to clipboard!');
    }
  };

  return (
    <div
      className="card animate-fade-in"
      style={{
        marginTop: '32px',
        border: '2px solid var(--emerald-primary)',
        background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-card-subtle) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative accent strip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, var(--emerald-primary) 0%, #2563eb 100%)',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--emerald-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--emerald-primary)',
            }}
          >
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.35rem' }}>Valuation Estimate Generated</h3>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--emerald-light)',
                  color: 'var(--emerald-primary)',
                  fontWeight: '700',
                }}
              >
                ID: HP-{prediction_id}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Computed via Scikit-learn Linear Regression model • {timestamp}
            </p>
          </div>
        </div>

        {/* Action Buttons: PDF & Share */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleShare}
            className="btn btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Share Valuation"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Download size={16} />
            <span>Download Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Main Valuation Highlight Banner */}
      <div
        style={{
          padding: '28px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-main)',
          border: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          alignItems: 'center',
          marginBottom: '28px',
        }}
      >
        <div>
          <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.04em' }}>
            PREDICTED FAIR MARKET VALUE
          </div>
          <div
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: '800',
              color: 'var(--emerald-primary)',
              lineHeight: 1.15,
              margin: '6px 0',
            }}
          >
            {formatted_price?.full || `₹${result.predicted_price}`}
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-main)' }}>
            Denominated: <span style={{ color: 'var(--emerald-primary)' }}>{formatted_price?.compact}</span>
          </div>
        </div>

        {/* Statistical Range & Rate */}
        <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
              ESTIMATED STATISTICAL RANGE (90% CONF.)
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
              {price_range?.formatted_lower?.compact} — {price_range?.formatted_upper?.compact}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ±{price_range?.margin_percent}% empirical error margin
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
              RATE PER SQ.FT
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--blue-accent)', marginTop: '2px' }}>
              {formatted_price_per_sqft}
            </div>
          </div>
        </div>

        {/* City Benchmark */}
        {city_benchmark?.diff_percent !== null && (
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
              CITY BENCHMARK COMPARISON
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <TrendingUp size={18} color={city_benchmark.diff_percent >= 0 ? 'var(--emerald-primary)' : '#3b82f6'} />
              <span style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>
                {city_benchmark.diff_percent > 0 ? `+${city_benchmark.diff_percent}%` : `${city_benchmark.diff_percent}%`}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              relative to average {inputs.City} listing
            </div>
          </div>
        )}
      </div>

      {/* Property Attribute Pills */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
          Evaluated Property Profile
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <span style={pillStyle}>
            <MapPin size={14} color="var(--emerald-primary)" />
            {inputs.City}
          </span>
          <span style={pillStyle}>
            <Building size={14} color="var(--emerald-primary)" />
            {inputs.Property_Type}
          </span>
          <span style={pillStyle}>
            <Maximize2 size={14} color="var(--emerald-primary)" />
            {inputs.Area_sqft} sq.ft
          </span>
          <span style={pillStyle}>
            {inputs.BHK} BHK / {inputs.Bathrooms} Bathrooms
          </span>
          <span style={pillStyle}>
            <Layers size={14} color="var(--emerald-primary)" />
            {inputs.Floors} {inputs.Floors === 1 ? 'Floor' : 'Floors'}
          </span>
          <span style={pillStyle}>
            <Clock size={14} color="var(--emerald-primary)" />
            {inputs.Property_Age === 0 ? 'New Construction' : `${inputs.Property_Age} Yrs Old`}
          </span>
          <span style={pillStyle}>
            Parking: {inputs.Parking}
          </span>
          <span style={pillStyle}>
            {inputs.Furnishing}
          </span>
          <span style={{ ...pillStyle, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--blue-accent)' }}>
            <ShieldCheck size={14} />
            Verified ML Estimate
          </span>
        </div>
      </div>
    </div>
  );
}

const pillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '999px',
  backgroundColor: 'var(--bg-main)',
  border: '1px solid var(--border-color)',
  fontSize: '0.82rem',
  fontWeight: '500',
  color: 'var(--text-main)',
};
