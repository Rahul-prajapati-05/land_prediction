/**
 * API Service for HomePrice AI Flask Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = {
  /**
   * Health check for backend server and ML model
   */
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend health check failed:', err);
      return { status: 'offline', model_loaded: false, error: err.message };
    }
  },

  /**
   * Send property features to ML model for price valuation
   */
  async predictPrice(propertyData) {
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to predict house price');
    }
    return data;
  },

  /**
   * Retrieve previous user predictions
   */
  async getHistory(limit = 50) {
    const res = await fetch(`${API_BASE_URL}/history?limit=${limit}`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch history');
    }
    return data.history;
  },

  /**
   * Delete a single prediction from history
   */
  async deleteHistoryItem(id) {
    const res = await fetch(`${API_BASE_URL}/history/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to delete record');
    }
    return data;
  },

  /**
   * Clear all prediction history
   */
  async clearHistory() {
    const res = await fetch(`${API_BASE_URL}/history`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to clear history');
    }
    return data;
  },

  /**
   * Retrieve dataset statistics, model metrics, and charts series
   */
  async getAnalytics() {
    const res = await fetch(`${API_BASE_URL}/analytics`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch analytics data');
    }
    return data.data;
  },

  /**
   * Direct download link for the CSV dataset
   */
  getDatasetDownloadUrl() {
    return `${API_BASE_URL}/download-dataset`;
  },

  /**
   * Send contact/inquiry message to Rahul Prajapati (rahulprajapati1480@gmail.com)
   */
  async sendContactInquiry(contactData) {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry via backend.');
      }
      return data;
    } catch (backendErr) {
      // Fallback directly to FormSubmit endpoint
      console.warn('Backend contact failed, falling back to FormSubmit direct dispatch:', backendErr);
      const fallbackRes = await fetch('https://formsubmit.co/ajax/rahulprajapati1480@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: contactData.name,
          email: contactData.email,
          _subject: `HomePrice AI Inquiry: ${contactData.subject}`,
          message: contactData.message,
        }),
      });
      return await fallbackRes.json();
    }
  }
};
