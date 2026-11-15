import React, { useState } from 'react';
import { 
  MapPin, 
  Maximize2, 
  Bed, 
  Bath, 
  Layers, 
  Clock, 
  Car, 
  Sofa, 
  Home, 
  Sparkles, 
  RotateCcw, 
  Calculator,
  Zap
} from 'lucide-react';

const CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad'
];

const PROPERTY_TYPES = [
  'Apartment',
  'Independent House',
  'Villa',
  'Penthouse'
];

const FURNISHING_TYPES = [
  'Unfurnished',
  'Semi-Furnished',
  'Furnished'
];

const INITIAL_FORM_STATE = {
  City: 'Bangalore',
  Area_sqft: 1550,
  BHK: 3,
  Bathrooms: 3,
  Floors: 1,
  Property_Age: 3,
  Parking: 'Yes',
  Furnishing: 'Semi-Furnished',
  Property_Type: 'Apartment'
};

const PRESETS = [
  {
    name: '🏙️ 3BHK Tech Corridor (Bangalore)',
    data: {
      City: 'Bangalore',
      Area_sqft: 1650,
      BHK: 3,
      Bathrooms: 3,
      Floors: 1,
      Property_Age: 2,
      Parking: 'Yes',
      Furnishing: 'Semi-Furnished',
      Property_Type: 'Apartment'
    }
  },
  {
    name: '🌊 Luxury Penthouse (Mumbai)',
    data: {
      City: 'Mumbai',
      Area_sqft: 3200,
      BHK: 4,
      Bathrooms: 5,
      Floors: 2,
      Property_Age: 1,
      Parking: 'Yes',
      Furnishing: 'Furnished',
      Property_Type: 'Penthouse'
    }
  },
  {
    name: '🏡 Spacious Villa (Hyderabad)',
    data: {
      City: 'Hyderabad',
      Area_sqft: 2800,
      BHK: 4,
      Bathrooms: 4,
      Floors: 2,
      Property_Age: 4,
      Parking: 'Yes',
      Furnishing: 'Semi-Furnished',
      Property_Type: 'Villa'
    }
  },
  {
    name: '🏢 Starter 1BHK (Pune)',
    data: {
      City: 'Pune',
      Area_sqft: 620,
      BHK: 1,
      Bathrooms: 1,
      Floors: 1,
      Property_Age: 5,
      Parking: 'No',
      Furnishing: 'Unfurnished',
      Property_Type: 'Apartment'
    }
  }
];

export default function PredictorForm({ onPredict, isLoading }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.City) newErrors.City = 'Please select a city.';
    
    const area = Number(formData.Area_sqft);
    if (!area || isNaN(area) || area < 300 || area > 10000) {
      newErrors.Area_sqft = 'Area must be between 300 and 10,000 sq.ft.';
    }

    const bhk = Number(formData.BHK);
    if (!bhk || isNaN(bhk) || bhk < 1 || bhk > 10) {
      newErrors.BHK = 'BHK must be between 1 and 10.';
    }

    const baths = Number(formData.Bathrooms);
    if (!baths || isNaN(baths) || baths < 1 || baths > 10) {
      newErrors.Bathrooms = 'Bathrooms must be between 1 and 10.';
    }

    const flrs = Number(formData.Floors);
    if (!flrs || isNaN(flrs) || flrs < 1 || flrs > 30) {
      newErrors.Floors = 'Floors must be between 1 and 30.';
    }

    const age = Number(formData.Property_Age);
    if (isNaN(age) || age < 0 || age > 60) {
      newErrors.Property_Age = 'Property age must be between 0 and 60 years.';
    }

    if (!formData.Parking) newErrors.Parking = 'Please specify parking availability.';
    if (!formData.Furnishing) newErrors.Furnishing = 'Please select furnishing status.';
    if (!formData.Property_Type) newErrors.Property_Type = 'Please select property type.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onPredict({
        ...formData,
        Area_sqft: parseFloat(formData.Area_sqft),
        BHK: parseInt(formData.BHK, 10),
        Bathrooms: parseInt(formData.Bathrooms, 10),
        Floors: parseInt(formData.Floors, 10),
        Property_Age: parseInt(formData.Property_Age, 10),
      });
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
  };

  const applyPreset = (preset) => {
    setFormData(preset.data);
    setErrors({});
  };

  return (
    <div className="card" style={{ padding: '36px' }}>
      {/* Header and Presets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Calculator size={22} color="var(--emerald-primary)" />
            <h3 style={{ fontSize: '1.4rem' }}>Property Valuation Inputs</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Enter all 9 property specifications to compute the Machine Learning valuation.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={14} color="#f59e0b" /> Quick Presets:
          </span>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              style={{
                fontSize: '0.78rem',
                padding: '5px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--emerald-primary)';
                e.target.style.color = 'var(--emerald-primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.color = 'var(--text-main)';
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid-3" style={{ marginBottom: '20px' }}>
          
          {/* 1. Location / City */}
          <div className="form-group">
            <label className="form-label">
              <MapPin size={16} color="var(--emerald-primary)" />
              <span>1. Location / City *</span>
            </label>
            <select
              name="City"
              className="form-select"
              value={formData.City}
              onChange={handleChange}
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.City && <span className="form-error">{errors.City}</span>}
          </div>

          {/* 2. Area (Square Feet) */}
          <div className="form-group">
            <label className="form-label">
              <Maximize2 size={16} color="var(--emerald-primary)" />
              <span>2. Area (Square Feet) *</span>
            </label>
            <input
              type="number"
              name="Area_sqft"
              className="form-input"
              placeholder="e.g. 1500"
              value={formData.Area_sqft}
              onChange={handleChange}
              min="300"
              max="10000"
              step="10"
            />
            {errors.Area_sqft && <span className="form-error">{errors.Area_sqft}</span>}
          </div>

          {/* 3. Number of Bedrooms (BHK) */}
          <div className="form-group">
            <label className="form-label">
              <Bed size={16} color="var(--emerald-primary)" />
              <span>3. Bedrooms (BHK) *</span>
            </label>
            <select
              name="BHK"
              className="form-select"
              value={formData.BHK}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>{num} BHK</option>
              ))}
            </select>
            {errors.BHK && <span className="form-error">{errors.BHK}</span>}
          </div>

          {/* 4. Number of Bathrooms */}
          <div className="form-group">
            <label className="form-label">
              <Bath size={16} color="var(--emerald-primary)" />
              <span>4. Bathrooms *</span>
            </label>
            <select
              name="Bathrooms"
              className="form-select"
              value={formData.Bathrooms}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>{num} {num === 1 ? 'Bathroom' : 'Bathrooms'}</option>
              ))}
            </select>
            {errors.Bathrooms && <span className="form-error">{errors.Bathrooms}</span>}
          </div>

          {/* 5. Number of Floors */}
          <div className="form-group">
            <label className="form-label">
              <Layers size={16} color="var(--emerald-primary)" />
              <span>5. Number of Floors *</span>
            </label>
            <select
              name="Floors"
              className="form-select"
              value={formData.Floors}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5].map((flr) => (
                <option key={flr} value={flr}>{flr} {flr === 1 ? 'Floor' : 'Floors'}</option>
              ))}
            </select>
            {errors.Floors && <span className="form-error">{errors.Floors}</span>}
          </div>

          {/* 6. Property Age (Years) */}
          <div className="form-group">
            <label className="form-label">
              <Clock size={16} color="var(--emerald-primary)" />
              <span>6. Property Age (Years) *</span>
            </label>
            <input
              type="number"
              name="Property_Age"
              className="form-input"
              placeholder="e.g. 3 (0 for new construction)"
              value={formData.Property_Age}
              onChange={handleChange}
              min="0"
              max="60"
            />
            {errors.Property_Age && <span className="form-error">{errors.Property_Age}</span>}
          </div>

          {/* 7. Parking Availability */}
          <div className="form-group">
            <label className="form-label">
              <Car size={16} color="var(--emerald-primary)" />
              <span>7. Parking Availability *</span>
            </label>
            <select
              name="Parking"
              className="form-select"
              value={formData.Parking}
              onChange={handleChange}
            >
              <option value="Yes">Yes (Dedicated Parking)</option>
              <option value="No">No Parking</option>
            </select>
            {errors.Parking && <span className="form-error">{errors.Parking}</span>}
          </div>

          {/* 8. Furnishing Status */}
          <div className="form-group">
            <label className="form-label">
              <Sofa size={16} color="var(--emerald-primary)" />
              <span>8. Furnishing Status *</span>
            </label>
            <select
              name="Furnishing"
              className="form-select"
              value={formData.Furnishing}
              onChange={handleChange}
            >
              {FURNISHING_TYPES.map((furn) => (
                <option key={furn} value={furn}>{furn}</option>
              ))}
            </select>
            {errors.Furnishing && <span className="form-error">{errors.Furnishing}</span>}
          </div>

          {/* 9. Property Type */}
          <div className="form-group">
            <label className="form-label">
              <Home size={16} color="var(--emerald-primary)" />
              <span>9. Property Type *</span>
            </label>
            <select
              name="Property_Type"
              className="form-select"
              value={formData.Property_Type}
              onChange={handleChange}
            >
              {PROPERTY_TYPES.map((ptype) => (
                <option key={ptype} value={ptype}>{ptype}</option>
              ))}
            </select>
            {errors.Property_Type && <span className="form-error">{errors.Property_Type}</span>}
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isLoading}
          >
            <RotateCcw size={16} />
            <span>Clear Form</span>
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ minWidth: '180px' }}
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                <span>Predicting...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Predict Price</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
