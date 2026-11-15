import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PredictorForm from './components/PredictorForm';
import PredictionResult from './components/PredictionResult';
import HowItWorks from './components/HowItWorks';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PredictionHistory from './components/PredictionHistory';
import MLGuide from './components/MLGuide';
import AboutProject from './components/AboutProject';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { api } from './services/api';
import { Calculator } from 'lucide-react';

export default function App() {
  // Theme Management (Light / Dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('homeprice_theme') || 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('homeprice_theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Application State
  const [backendHealth, setBackendHealth] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const predictorRef = useRef(null);
  const resultRef = useRef(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Initial Data Fetching
  const loadData = async () => {
    try {
      const health = await api.checkHealth();
      setBackendHealth(health);

      const analytics = await api.getAnalytics();
      setAnalyticsData(analytics);

      const savedHistory = await api.getHistory(50);
      setHistory(savedHistory);
    } catch (err) {
      console.error('Initial data load error:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Predict Submission
  const handlePredict = async (propertyData) => {
    setIsPredicting(true);
    try {
      const result = await api.predictPrice(propertyData);
      setCurrentPrediction(result);
      showToast(`Valuation computed: ${result.formatted_price.compact}`, 'success');

      // Refresh history list
      const updatedHistory = await api.getHistory(50);
      setHistory(updatedHistory);

      // Smooth scroll to result
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 150);
    } catch (err) {
      showToast(err.message || 'Error computing valuation. Please check inputs.', 'error');
    } finally {
      setIsPredicting(false);
    }
  };

  // Handle Delete History Item
  const handleDeleteHistoryItem = async (id) => {
    try {
      await api.deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      showToast(`Record #${id} deleted.`, 'info');
    } catch (err) {
      showToast('Failed to delete history record.', 'error');
    }
  };

  // Handle Clear All History
  const handleClearHistory = async () => {
    try {
      await api.clearHistory();
      setHistory([]);
      showToast('All prediction history cleared.', 'info');
    } catch (err) {
      showToast('Failed to clear history.', 'error');
    }
  };

  // Refresh History
  const handleRefreshHistory = async () => {
    setIsHistoryLoading(true);
    try {
      const updated = await api.getHistory(50);
      setHistory(updated);
      showToast('History refreshed.', 'info');
    } catch (err) {
      showToast('Failed to refresh history.', 'error');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Navigation */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        backendHealth={backendHealth}
      />

      {/* Hero Section */}
      <Hero
        analyticsData={analyticsData}
        onPredictClick={() => {
          if (predictorRef.current) {
            predictorRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* House Price Prediction Form Section */}
      <section id="predictor" ref={predictorRef} className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          
          <div className="section-header">
            <div className="section-badge">
              <Calculator size={14} />
              <span>Real-Time Estimation Engine</span>
            </div>
            <h2 className="section-title">Estimate House Valuation</h2>
            <p className="section-subtitle">
              Input 9 detailed property parameters to receive an econometric fair market price appraisal,
              confidence interval bounds, and downloadable certificate.
            </p>
          </div>

          <PredictorForm
            onPredict={handlePredict}
            isLoading={isPredicting}
          />

          {/* Result Card */}
          <div ref={resultRef}>
            {currentPrediction && (
              <PredictionResult
                result={currentPrediction}
                onReset={() => setCurrentPrediction(null)}
              />
            )}
          </div>

        </div>
      </section>

      {/* How It Works (4-Stage Pipeline) */}
      <HowItWorks />

      {/* Analytics & Charts Dashboard */}
      <AnalyticsDashboard
        analyticsData={analyticsData}
        isDark={theme === 'dark'}
      />

      {/* Historical Audit Trail */}
      <PredictionHistory
        history={history}
        onDeleteItem={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
        onRefreshHistory={handleRefreshHistory}
        isLoading={isHistoryLoading}
      />

      {/* ML Guide & Mathematical Formula */}
      <MLGuide
        metrics={analyticsData?.metrics}
      />

      {/* About Project & Tech Stack Architecture */}
      <AboutProject />

      {/* Contact & Inquiries */}
      <ContactSection
        showToast={showToast}
      />

      {/* Footer */}
      <Footer />

      {/* Toast Notification */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
