import React, { useState } from 'react';
import './TestCall.css';

function TestCall() {
  const [formData, setFormData] = useState({
    farmerName: '',
    villageStreet: '',
    mandal: '',
    district: '',
    pincode: '',
    phoneNumber: '',
    state: '',
    language: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getApiBase = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 1. Farmer Name
    if (!formData.farmerName.trim()) {
      newErrors.farmerName = 'Farmer Name is required.';
    } else if (formData.farmerName.trim().length < 2) {
      newErrors.farmerName = 'Farmer Name must be at least 2 characters.';
    }

    // 2. Village / Street
    if (!formData.villageStreet.trim()) {
      newErrors.villageStreet = 'Village / Street is required.';
    }

    // 3. Mandal
    if (!formData.mandal.trim()) {
      newErrors.mandal = 'Mandal is required.';
    }

    // 4. District
    if (!formData.district.trim()) {
      newErrors.district = 'District is required.';
    }

    // 5. Pincode
    const pincodeClean = formData.pincode ? String(formData.pincode).trim() : '';
    if (!pincodeClean) {
      newErrors.pincode = 'Pincode is required.';
    } else if (!/^\d{6}$/.test(pincodeClean)) {
      newErrors.pincode = 'Pincode must be a 6-digit number.';
    }

    // 6. Phone Number
    const phoneClean = formData.phoneNumber.replace(/\s+/g, '');
    if (!phoneClean) {
      newErrors.phoneNumber = 'Phone Number is required.';
    } else if (!/^(\+91)?[6-9]\d{9}$/.test(phoneClean)) {
      newErrors.phoneNumber = 'Enter a valid 10-digit phone number (e.g. 9876543210).';
    }

    // 7. State
    if (!formData.state) {
      newErrors.state = 'Please select a State.';
    }

    // 8. Language
    if (!formData.language) {
      newErrors.language = 'Please select a Language.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setResponseMsg(null);
    setErrorMsg(null);

    try {
      const apiBase = getApiBase();
      const token = localStorage.getItem('farmcall_token');

      const payload = {
        farmerName: formData.farmerName,
        village: formData.villageStreet,
        mandal: formData.mandal,
        district: formData.district,
        pincode: formData.pincode,
        phoneNumber: formData.phoneNumber,
        state: formData.state,
        language: formData.language,
      };

      const response = await fetch(`${apiBase}/farmcall/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMsg(
          typeof data === 'string'
            ? data
            : data.farmerSummary || data.message || JSON.stringify(data, null, 2)
        );
      } else {
        setErrorMsg(data.message || data.error || 'Failed to trigger test call.');
      }
    } catch (err) {
      console.error('Test call submit error:', err);
      setErrorMsg(err.message || 'Error connecting to backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="test-call-page">
      <div className="test-call-card">
        {/* Page Header */}
        <div className="test-call-header">
          <h1 className="test-call-title">Test Call</h1>
          <p className="test-call-subtitle">
            Enter farmer details to initiate a live voice test call.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="test-call-form" noValidate>
          <div className="test-call-form-grid">
            {/* 1. Farmer Name */}
            <div className={`form-field ${errors.farmerName ? 'has-error' : ''}`}>
              <label htmlFor="farmerName">
                Farmer Name <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="farmerName"
                name="farmerName"
                placeholder="e.g. Ramesh Kumar"
                value={formData.farmerName}
                onChange={handleChange}
              />
              {errors.farmerName && <span className="error-message">{errors.farmerName}</span>}
            </div>

            {/* 2. Village / Street */}
            <div className={`form-field ${errors.villageStreet ? 'has-error' : ''}`}>
              <label htmlFor="villageStreet">
                Village / Street <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="villageStreet"
                name="villageStreet"
                placeholder="e.g. Main Street, Green Valley"
                value={formData.villageStreet}
                onChange={handleChange}
              />
              {errors.villageStreet && <span className="error-message">{errors.villageStreet}</span>}
            </div>

            {/* 3. Mandal */}
            <div className={`form-field ${errors.mandal ? 'has-error' : ''}`}>
              <label htmlFor="mandal">
                Mandal <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="mandal"
                name="mandal"
                placeholder="e.g. Ananthapur Mandal"
                value={formData.mandal}
                onChange={handleChange}
              />
              {errors.mandal && <span className="error-message">{errors.mandal}</span>}
            </div>

            {/* 4. District */}
            <div className={`form-field ${errors.district ? 'has-error' : ''}`}>
              <label htmlFor="district">
                District <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="district"
                name="district"
                placeholder="e.g. Ananthapur District"
                value={formData.district}
                onChange={handleChange}
              />
              {errors.district && <span className="error-message">{errors.district}</span>}
            </div>

            {/* 5. Pincode */}
            <div className={`form-field ${errors.pincode ? 'has-error' : ''}`}>
              <label htmlFor="pincode">
                Pincode <span className="required-asterisk">*</span>
              </label>
              <input
                type="number"
                id="pincode"
                name="pincode"
                placeholder="e.g. 515001"
                value={formData.pincode}
                onChange={handleChange}
              />
              {errors.pincode && <span className="error-message">{errors.pincode}</span>}
            </div>

            {/* 6. Phone Number */}
            <div className={`form-field ${errors.phoneNumber ? 'has-error' : ''}`}>
              <label htmlFor="phoneNumber">
                Phone Number <span className="required-asterisk">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="e.g. +91 9876543210"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
            </div>

            {/* 7. State */}
            <div className={`form-field ${errors.state ? 'has-error' : ''}`}>
              <label htmlFor="state">
                State <span className="required-asterisk">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select State
                  </option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
                <span className="select-arrow">▾</span>
              </div>
              {errors.state && <span className="error-message">{errors.state}</span>}
            </div>

            {/* 8. Language */}
            <div className={`form-field ${errors.language ? 'has-error' : ''}`}>
              <label htmlFor="language">
                Language <span className="required-asterisk">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Language
                  </option>
                  <option value="Telugu">Telugu</option>
                  <option value="Tamil">Tamil</option>
                  <option value="English">English</option>
                  <option value="Kannada">Kannada</option>
                </select>
                <span className="select-arrow">▾</span>
              </div>
              {errors.language && <span className="error-message">{errors.language}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="start-test-call-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing Call...' : 'Start Test Call'}
          </button>
        </form>

        {/* Response Box displayed right under the button */}
        {isSubmitting && (
          <div className="test-call-status-box loading">
            <div className="spinner"></div>
            <span>Connecting to FarmCall engine & initiating voice call...</span>
          </div>
        )}

        {responseMsg && (
          <div className="test-call-status-box success">
            <div className="status-header">
              <span className="status-icon">✓</span>
              <h3>Test Call Initiated Successfully</h3>
            </div>
            <div className="status-body">
              <p className="response-title">Generated Voice Script:</p>
              <div className="response-content">{responseMsg}</div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="test-call-status-box error">
            <div className="status-header">
              <span className="status-icon">✕</span>
              <h3>Test Call Failed</h3>
            </div>
            <div className="status-body">
              <p>{errorMsg}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestCall;
