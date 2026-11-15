import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { message, type } = toast;

  let bg = 'var(--bg-card)';
  let borderColor = 'var(--border-color)';
  let icon = <Info size={18} color="var(--blue-accent)" />;

  if (type === 'success') {
    borderColor = 'var(--emerald-primary)';
    icon = <CheckCircle size={18} color="var(--emerald-primary)" />;
  } else if (type === 'error') {
    borderColor = '#ef4444';
    icon = <AlertTriangle size={18} color="#ef4444)" />;
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: bg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-xl)',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '420px',
      }}
    >
      {icon}
      <span style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--text-main)', flex: 1 }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
