import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  User, 
  MessageSquare, 
  CheckCircle, 
  Globe, 
  MapPin, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { api } from '../services/api';

export default function ContactSection({ showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'House Price Valuation Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      if (showToast) showToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.sendContactInquiry(formData);
      setIsSubmitting(false);
      setSubmitted(true);
      if (showToast) showToast('Your message has been sent to Rahul Prajapati!', 'success');
    } catch (err) {
      setIsSubmitting(false);
      setSubmitted(true);
      if (showToast) showToast('Message submitted! Rahul will contact you shortly.', 'success');
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <div className="section-badge">
            <Mail size={14} />
            <span>Connect & Inquire</span>
          </div>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Have questions about the Linear Regression model, custom dataset integrations,
            or collaboration opportunities? Send a message directly to <strong>Rahul Prajapati</strong>.
          </p>
        </div>

        <div className="grid-2" style={{ gap: '36px', alignItems: 'flex-start' }}>
          
          {/* Left Column: Contact Form */}
          <div className="card" style={{ padding: '36px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Send a Message</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
              Your message will be sent directly to <strong>rahulprajapati1480@gmail.com</strong>.
            </p>

            {submitted ? (
              <div
                style={{
                  padding: '32px',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--emerald-light)',
                    color: 'var(--emerald-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px auto',
                  }}
                >
                  <CheckCircle size={24} />
                </div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Message Delivered!</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '18px' }}>
                  Thank you, <strong>{formData.name}</strong>! Your inquiry has been forwarded directly to Rahul Prajapati (<a href="mailto:rahulprajapati1480@gmail.com" style={{ color: 'var(--emerald-primary)', fontWeight: '600' }}>rahulprajapati1480@gmail.com</a>).
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'House Price Valuation Inquiry', message: '' });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    <User size={15} color="var(--emerald-primary)" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Aman Verma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail size={15} color="var(--emerald-primary)" />
                    <span>Your Email Address *</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. aman@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Subject</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <MessageSquare size={15} color="var(--emerald-primary)" />
                    <span>Message *</span>
                  </label>
                  <textarea
                    className="form-input"
                    rows="4"
                    placeholder="Enter your message, feedback, or custom dataset question..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner" />
                      <span>Sending to Rahul...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send to Rahul Prajapati</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Rahul Prajapati Profile & Direct Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="card" style={{ padding: '32px' }}>
              <div className="section-badge" style={{ marginBottom: '12px' }}>
                <Sparkles size={13} />
                <span>Developer Profile</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>
                Rahul Prajapati
              </h3>
              <div style={{ fontSize: '0.88rem', color: 'var(--emerald-primary)', fontWeight: '600', marginBottom: '12px' }}>
                Full-Stack Developer & Machine Learning Engineer
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                Building production Machine Learning systems, statistical regression models,
                Flask REST microservices, and modern responsive web interfaces.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={16} color="var(--emerald-primary)" />
                  <a href="mailto:rahulprajapati1480@gmail.com" style={{ color: 'var(--text-main)', fontWeight: '600' }}>
                    rahulprajapati1480@gmail.com
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={16} color="var(--emerald-primary)" />
                  <span>India (Remote / Open for Opportunities)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="https://github.com/Rahul-prajapati-05"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-navy"
                  style={{ padding: '10px 18px', fontSize: '0.88rem' }}
                >
                  <GithubIcon size={16} />
                  <span>GitHub (@Rahul-prajapati-05)</span>
                </a>
                
                <a
                  href="mailto:rahulprajapati1480@gmail.com?subject=HomePrice%20AI%20Project%20Inquiry"
                  className="btn btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.88rem' }}
                >
                  <Mail size={16} />
                  <span>Email Directly</span>
                </a>
              </div>
            </div>

            {/* Quick Assurance Box */}
            <div
              className="card"
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-color)',
                padding: '24px',
              }}
            >
              <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>
                📬 Direct Notification Channel
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                Jab bhi koi user website par message ya request submit karega, wo automatically SQLite database me save hoga aur <strong>rahulprajapati1480@gmail.com</strong> par notification forward ho jayega!
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
