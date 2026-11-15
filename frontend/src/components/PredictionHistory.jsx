import React, { useState } from 'react';
import { 
  Clock, 
  Trash2, 
  Eye, 
  RotateCcw, 
  MapPin, 
  Building, 
  Maximize2, 
  X, 
  Download,
  AlertCircle 
} from 'lucide-react';
import { generateValuationPDF } from '../services/pdfGenerator';

export default function PredictionHistory({ 
  history, 
  onDeleteItem, 
  onClearHistory, 
  onRefreshHistory, 
  isLoading 
}) {
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleDownloadModalPDF = () => {
    if (!selectedRecord) return;
    
    // Construct valuation data payload compatible with PDF generator
    const pdfData = {
      prediction_id: selectedRecord.id,
      timestamp: selectedRecord.timestamp,
      predicted_price: selectedRecord.predicted_price,
      formatted_price: {
        combined: selectedRecord.formatted_price,
        full: `₹${Math.round(selectedRecord.predicted_price).toLocaleString('en-IN')}`,
        compact: selectedRecord.formatted_price
      },
      price_range: {
        formatted_lower: { compact: `₹${(selectedRecord.price_lower / 100000).toFixed(1)}L` },
        formatted_upper: { compact: `₹${(selectedRecord.price_upper / 10000000).toFixed(2)}Cr` },
        margin_percent: 18.5
      },
      formatted_price_per_sqft: `₹${(selectedRecord.predicted_price / selectedRecord.area_sqft).toFixed(0)} / sq.ft`,
      inputs: {
        City: selectedRecord.city,
        Area_sqft: selectedRecord.area_sqft,
        BHK: selectedRecord.bhk,
        Bathrooms: selectedRecord.bathrooms,
        Floors: selectedRecord.floors,
        Property_Age: selectedRecord.property_age,
        Parking: selectedRecord.parking,
        Furnishing: selectedRecord.furnishing,
        Property_Type: selectedRecord.property_type
      }
    };

    generateValuationPDF(pdfData);
  };

  return (
    <section id="history" className="section">
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
          <div>
            <div className="section-badge">
              <Clock size={14} />
              <span>Historical Inferences</span>
            </div>
            <h2 className="section-title">Prediction History</h2>
            <p className="section-subtitle">
              Audit trail of previous property valuations stored persistently in SQLite.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={onRefreshHistory}
              className="btn btn-secondary"
              title="Refresh History"
              disabled={isLoading}
              style={{ padding: '10px 16px' }}
            >
              <RotateCcw size={16} />
              <span>Refresh</span>
            </button>

            {history && history.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete all prediction history?')) {
                    onClearHistory();
                  }
                }}
                className="btn btn-danger"
                style={{ padding: '10px 16px' }}
              >
                <Trash2 size={16} />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* History Table / Empty State */}
        {!history || history.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              border: '1.5px dashed var(--border-color)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-card-subtle)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <Clock size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Saved Predictions Yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 20px auto' }}>
              Your recent real estate valuations will appear here automatically with full specifications and download options.
            </p>
            <a href="#predictor" className="btn btn-primary">
              Make Your First Prediction
            </a>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'var(--bg-card-subtle)',
                      borderBottom: '1px solid var(--border-color)',
                      fontSize: '0.82rem',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    <th style={{ padding: '16px 20px' }}>Date & Time</th>
                    <th style={{ padding: '16px 20px' }}>Location</th>
                    <th style={{ padding: '16px 20px' }}>Type</th>
                    <th style={{ padding: '16px 20px' }}>Area (sq.ft)</th>
                    <th style={{ padding: '16px 20px' }}>BHK</th>
                    <th style={{ padding: '16px 20px' }}>Predicted Price</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr
                      key={record.id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background-color 0.2s',
                        fontSize: '0.92rem',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-main)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {record.timestamp}
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: '600' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={15} color="var(--emerald-primary)" />
                          <span>{record.city}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>{record.property_type}</td>
                      <td style={{ padding: '16px 20px' }}>{record.area_sqft} sq.ft</td>
                      <td style={{ padding: '16px 20px' }}>{record.bhk} BHK</td>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--emerald-primary)' }}>
                        {record.formatted_price}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setSelectedRecord(record)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--bg-card-subtle)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--text-main)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.8rem',
                            }}
                            title="View Prediction Details"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete valuation record for ${record.city} (${record.area_sqft} sq.ft)?`)) {
                                onDeleteItem(record.id);
                              }
                            }}
                            style={{
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              color: '#ef4444',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.8rem',
                            }}
                            title="Delete this record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {selectedRecord && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px',
            }}
            onClick={() => setSelectedRecord(null)}
          >
            <div
              className="card animate-fade-in"
              style={{
                width: '100%',
                maxWidth: '560px',
                padding: '32px',
                backgroundColor: 'var(--bg-card)',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedRecord(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  color: 'var(--text-muted)',
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Building size={20} color="var(--emerald-primary)" />
                <h3 style={{ fontSize: '1.3rem' }}>Valuation Record #{selectedRecord.id}</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '20px' }}>
                Predicted on {selectedRecord.timestamp}
              </p>

              <div
                style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                  Predicted Market Value
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--emerald-primary)', margin: '4px 0' }}>
                  {selectedRecord.formatted_price}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Unit Rate: ₹{(selectedRecord.predicted_price / selectedRecord.area_sqft).toFixed(0)} / sq.ft
                </div>
              </div>

              {/* Grid of properties */}
              <div className="grid-2" style={{ gap: '14px', marginBottom: '24px', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Location: </span>
                  <strong>{selectedRecord.city}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Type: </span>
                  <strong>{selectedRecord.property_type}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Carpet Area: </span>
                  <strong>{selectedRecord.area_sqft} sq.ft</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Bedrooms: </span>
                  <strong>{selectedRecord.bhk} BHK</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Bathrooms: </span>
                  <strong>{selectedRecord.bathrooms}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Floors: </span>
                  <strong>{selectedRecord.floors}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Property Age: </span>
                  <strong>{selectedRecord.property_age} Years</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Parking: </span>
                  <strong>{selectedRecord.parking}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Furnishing: </span>
                  <strong>{selectedRecord.furnishing}</strong>
                </div>
              </div>

              {/* Action */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleDownloadModalPDF}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <Download size={16} />
                  <span>Download Valuation PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
