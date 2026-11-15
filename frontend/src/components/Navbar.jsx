import React, { useState, useEffect } from 'react';
import { Home, Moon, Sun, Menu, X, Activity, BarChart3, Clock, BookOpen, Info, PhoneCall } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, backendHealth }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero', icon: Home },
    { name: 'Predict Price', href: '#predictor', icon: Activity },
    { name: 'Analytics', href: '#analytics', icon: BarChart3 },
    { name: 'History', href: '#history', icon: Clock },
    { name: 'ML Guide', href: '#ml-guide', icon: BookOpen },
    { name: 'About', href: '#about', icon: Info },
    { name: 'Contact', href: '#contact', icon: PhoneCall },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: isScrolled ? 'var(--bg-nav)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: isScrolled ? '12px 0' : '20px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--emerald-primary) 0%, #0f1e3c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
            }}
          >
            <Home size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>HomePrice</span>
              <span style={{ color: 'var(--emerald-primary)' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '500', marginTop: '-2px' }}>
              ML Property Valuation
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '28px', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                fontSize: '0.92rem',
                fontWeight: '600',
                color: 'var(--text-main)',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--emerald-primary)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text-main)')}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action Items: Health status, Theme Toggle, Mobile Burger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Health status badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: '600',
              backgroundColor: backendHealth?.model_loaded ? 'var(--emerald-light)' : 'rgba(239, 68, 68, 0.15)',
              color: backendHealth?.model_loaded ? 'var(--emerald-primary)' : '#ef4444',
              border: `1px solid ${backendHealth?.model_loaded ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.3)'}`,
            }}
            title={backendHealth?.model_loaded ? 'Linear Regression Model Online' : 'Connecting to ML Backend'}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: backendHealth?.model_loaded ? 'var(--emerald-primary)' : '#ef4444',
                boxShadow: backendHealth?.model_loaded ? '0 0 8px var(--emerald-primary)' : 'none',
              }}
            />
            <span>{backendHealth?.model_loaded ? 'ML Online' : 'Model Offline'}</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
              transition: 'all 0.2s',
            }}
            aria-label="Toggle light/dark theme"
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
            }}
            className="mobile-nav-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: 'var(--text-main)',
                  backgroundColor: 'var(--bg-main)',
                }}
              >
                <Icon size={18} color="var(--emerald-primary)" />
                <span>{link.name}</span>
              </a>
            );
          })}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
