import React, { useState, useEffect } from 'react';
import './Farmers.css';

function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Modal State: null = closed, 'register' = add new, 'edit' = edit farmer, 'delete' = confirm delete
  const [modalType, setModalType] = useState(null);
  const [currentFarmer, setCurrentFarmer] = useState(null);

  // Form State
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

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getApiBase = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return 'https://farmcall-project-1.onrender.com';
  };

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const apiBase = getApiBase();
      const token = localStorage.getItem('farmcall_token');
      const response = await fetch(`${apiBase}/farmers/`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setFarmers(data.data || []);
      } else {
        showFeedback('error', data.message || 'Failed to fetch farmers list.');
      }
    } catch (err) {
      console.error('Error fetching farmers:', err);
      showFeedback('error', 'Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const showFeedback = (type, text) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  // Open Modal for Registering New Farmer
  const handleOpenRegisterModal = () => {
    setFormData({
      farmerName: '',
      villageStreet: '',
      mandal: '',
      district: '',
      pincode: '',
      phoneNumber: '',
      state: '',
      language: '',
    });
    setFormErrors({});
    setCurrentFarmer(null);
    setModalType('register');
  };

  // Open Modal for Editing Farmer
  const handleOpenEditModal = (farmer) => {
    setCurrentFarmer(farmer);
    setFormData({
      farmerName: farmer.farmerName || farmer.farmer_name || '',
      villageStreet: farmer.villageStreet || farmer.village || '',
      mandal: farmer.mandal || '',
      district: farmer.district || '',
      pincode: farmer.pincode || '',
      phoneNumber: farmer.phoneNumber || farmer.phone_number || '',
      state: farmer.state || '',
      language: farmer.language || '',
    });
    setFormErrors({});
    setModalType('edit');
  };

  // Open Modal for Confirming Delete
  const handleOpenDeleteModal = (farmer) => {
    setCurrentFarmer(farmer);
    setModalType('delete');
  };

  const handleCloseModal = () => {
    setModalType(null);
    setCurrentFarmer(null);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'phoneNumber') {
      finalValue = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.farmerName.trim()) {
      errors.farmerName = 'Farmer Name is required.';
    } else if (formData.farmerName.trim().length < 2) {
      errors.farmerName = 'Farmer Name must be at least 2 characters.';
    }

    if (!formData.villageStreet.trim()) {
      errors.villageStreet = 'Village / Street is required.';
    }

    if (!formData.mandal.trim()) {
      errors.mandal = 'Mandal is required.';
    }

    if (!formData.district.trim()) {
      errors.district = 'District is required.';
    }

    const pincodeClean = formData.pincode ? String(formData.pincode).trim() : '';
    if (!pincodeClean) {
      errors.pincode = 'Pincode is required.';
    } else if (!/^\d{6}$/.test(pincodeClean)) {
      errors.pincode = 'Pincode must be a 6-digit number.';
    }

    const phoneClean = formData.phoneNumber ? formData.phoneNumber.replace(/\D/g, '') : '';
    if (!phoneClean) {
      errors.phoneNumber = 'Phone Number is required.';
    } else if (phoneClean.length !== 10 || !/^[6-9]\d{9}$/.test(phoneClean)) {
      errors.phoneNumber = 'Enter a valid 10-digit phone number starting with 6-9.';
    }

    if (!formData.state) {
      errors.state = 'Please select a State.';
    }

    if (!formData.language) {
      errors.language = 'Please select a Language.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler for Create / Edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const apiBase = getApiBase();
      const token = localStorage.getItem('farmcall_token');

      const payload = {
        farmerName: formData.farmerName,
        farmer_name: formData.farmerName,
        village: formData.villageStreet,
        villageStreet: formData.villageStreet,
        mandal: formData.mandal,
        district: formData.district,
        pincode: formData.pincode,
        phoneNumber: formData.phoneNumber,
        phone_number: formData.phoneNumber,
        state: formData.state,
        language: formData.language,
      };

      let url = `${apiBase}/farmers/register`;
      let method = 'POST';

      if (modalType === 'edit' && currentFarmer?._id) {
        url = `${apiBase}/farmers/${currentFarmer._id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        showFeedback(
          'success',
          modalType === 'edit' ? 'Farmer updated successfully!' : 'Farmer registered successfully!'
        );
        handleCloseModal();
        fetchFarmers();
      } else {
        showFeedback('error', data.message || 'Failed to save farmer details.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      showFeedback('error', 'Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete Handler
  const handleConfirmDelete = async () => {
    if (!currentFarmer?._id) return;
    setIsSubmitting(true);
    try {
      const apiBase = getApiBase();
      const token = localStorage.getItem('farmcall_token');
      const response = await fetch(`${apiBase}/farmers/${currentFarmer._id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (response.ok) {
        showFeedback('success', 'Farmer deleted successfully!');
        handleCloseModal();
        fetchFarmers();
      } else {
        showFeedback('error', data.message || 'Failed to delete farmer.');
      }
    } catch (err) {
      console.error('Error deleting farmer:', err);
      showFeedback('error', 'Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter Farmers based on search term
  const filteredFarmers = farmers.filter((f) => {
    const term = searchTerm.toLowerCase();
    const name = (f.farmerName || f.farmer_name || '').toLowerCase();
    const village = (f.village || f.villageStreet || '').toLowerCase();
    const phone = (f.phoneNumber || f.phone_number || '').toLowerCase();
    const district = (f.district || '').toLowerCase();
    return name.includes(term) || village.includes(term) || phone.includes(term) || district.includes(term);
  });

  return (
    <div className="farmers-page">
      {/* Toast Feedback Notification */}
      {feedbackMsg && (
        <div className={`feedback-toast ${feedbackMsg.type}`}>
          <span>{feedbackMsg.type === 'success' ? '✓' : '✕'}</span>
          {feedbackMsg.text}
        </div>
      )}

      <div className="farmers-card">
        {/* Header section with Top Right Register Button */}
        <div className="farmers-header">
          <div>
            <h1 className="farmers-title">Farmer Management</h1>
            <p className="farmers-subtitle">
              Manage registered farmers, edit details, or add new farmer profiles.
            </p>
          </div>
          <button className="register-farmer-btn" onClick={handleOpenRegisterModal}>
            <span className="btn-icon">+</span> Register Farmer
          </button>
        </div>

        {/* Search Bar & Stats */}
        <div className="farmers-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, village, district or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="farmer-count-badge">
            Total Farmers: <strong>{farmers.length}</strong>
          </div>
        </div>

        {/* Table Container */}
        {loading ? (
          <div className="table-loading">
            <div className="spinner"></div>
            <p>Loading farmers data...</p>
          </div>
        ) : filteredFarmers.length === 0 ? (
          <div className="empty-table-state">
            <p className="empty-title">No Farmers Found</p>
            <p className="empty-subtitle">
              {searchTerm ? 'No farmer records match your search filter.' : 'You haven’t registered any farmers yet.'}
            </p>
            {!searchTerm && (
              <button className="register-farmer-btn" onClick={handleOpenRegisterModal}>
                + Register First Farmer
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="farmers-table">
              <thead>
                <tr>
                  <th>Farmer Name</th>
                  <th>Village / Street</th>
                  <th>Mandal</th>
                  <th>District</th>
                  <th>Pincode</th>
                  <th>Phone Number</th>
                  <th>State</th>
                  <th>Language</th>
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.map((f) => (
                  <tr key={f._id}>
                    <td className="font-semibold">{f.farmerName || f.farmer_name || 'N/A'}</td>
                    <td>{f.village || f.villageStreet || 'N/A'}</td>
                    <td>{f.mandal || 'N/A'}</td>
                    <td>{f.district || 'N/A'}</td>
                    <td>{f.pincode || 'N/A'}</td>
                    <td>{f.phoneNumber || f.phone_number || 'N/A'}</td>
                    <td>{f.state || 'N/A'}</td>
                    <td>
                      <span className="lang-badge">{f.language || 'English'}</span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleOpenEditModal(f)}
                        title="Edit Farmer"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleOpenDeleteModal(f)}
                        title="Delete Farmer"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Registering or Editing Farmer */}
      {(modalType === 'register' || modalType === 'edit') && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalType === 'edit' ? 'Edit Farmer Details' : 'Register New Farmer'}</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>✕</button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form" noValidate>
              <div className="form-grid">
                {/* Farmer Name */}
                <div className={`form-field ${formErrors.farmerName ? 'has-error' : ''}`}>
                  <label>Farmer Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="farmerName"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.farmerName}
                    onChange={handleInputChange}
                  />
                  {formErrors.farmerName && <span className="error-text">{formErrors.farmerName}</span>}
                </div>

                {/* Village / Street */}
                <div className={`form-field ${formErrors.villageStreet ? 'has-error' : ''}`}>
                  <label>Village / Street <span className="required">*</span></label>
                  <input
                    type="text"
                    name="villageStreet"
                    placeholder="e.g. Singarapuram"
                    value={formData.villageStreet}
                    onChange={handleInputChange}
                  />
                  {formErrors.villageStreet && <span className="error-text">{formErrors.villageStreet}</span>}
                </div>

                {/* Mandal */}
                <div className={`form-field ${formErrors.mandal ? 'has-error' : ''}`}>
                  <label>Mandal <span className="required">*</span></label>
                  <input
                    type="text"
                    name="mandal"
                    placeholder="e.g. Kuppam"
                    value={formData.mandal}
                    onChange={handleInputChange}
                  />
                  {formErrors.mandal && <span className="error-text">{formErrors.mandal}</span>}
                </div>

                {/* District */}
                <div className={`form-field ${formErrors.district ? 'has-error' : ''}`}>
                  <label>District <span className="required">*</span></label>
                  <input
                    type="text"
                    name="district"
                    placeholder="e.g. Chittoor"
                    value={formData.district}
                    onChange={handleInputChange}
                  />
                  {formErrors.district && <span className="error-text">{formErrors.district}</span>}
                </div>

                {/* Pincode */}
                <div className={`form-field ${formErrors.pincode ? 'has-error' : ''}`}>
                  <label>Pincode <span className="required">*</span></label>
                  <input
                    type="number"
                    name="pincode"
                    placeholder="e.g. 517425"
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                  {formErrors.pincode && <span className="error-text">{formErrors.pincode}</span>}
                </div>

                {/* Phone Number */}
                <div className={`form-field ${formErrors.phoneNumber ? 'has-error' : ''}`}>
                  <label>Phone Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                  {formErrors.phoneNumber && <span className="error-text">{formErrors.phoneNumber}</span>}
                </div>

                {/* State */}
                <div className={`form-field ${formErrors.state ? 'has-error' : ''}`}>
                  <label>State <span className="required">*</span></label>
                  <select name="state" value={formData.state} onChange={handleInputChange}>
                    <option value="" disabled>Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Bihar">Bihar</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Odisha">Odisha</option>
                  </select>
                  {formErrors.state && <span className="error-text">{formErrors.state}</span>}
                </div>

                {/* Language */}
                <div className={`form-field ${formErrors.language ? 'has-error' : ''}`}>
                  <label>Language <span className="required">*</span></label>
                  <select name="language" value={formData.language} onChange={handleInputChange}>
                    <option value="" disabled>Select Language</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Tamil">Tamil</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Malayalam">Malayalam</option>
                  </select>
                  {formErrors.language && <span className="error-text">{formErrors.language}</span>}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting
                    ? 'Saving...'
                    : modalType === 'edit'
                    ? 'Update Farmer'
                    : 'Register Farmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Delete Confirmation */}
      {modalType === 'delete' && currentFarmer && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-card delete-card" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon">⚠️</div>
            <h2>Confirm Delete</h2>
            <p>
              Are you sure you want to delete farmer{' '}
              <strong>{currentFarmer.farmerName || currentFarmer.farmer_name || 'this farmer'}</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={handleConfirmDelete} disabled={isSubmitting}>
                {isSubmitting ? 'Deleting...' : 'Delete Farmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Farmers;
