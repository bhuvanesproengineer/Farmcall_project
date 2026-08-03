import React, { useState, useEffect } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState({
    submitting: false,
    success: null,
    error: null
  });

  useEffect(() => {
    document.title = 'Contact Us | FarmCall - Empowering Farmers with AI Voice Intelligence';
    window.scrollTo(0, 0);
  }, []);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setContactStatus({ submitting: false, success: null, error: '⚠️ All fields are required.' });
      return;
    }

    if (!validateEmail(email)) {
      setContactStatus({ submitting: false, success: null, error: '⚠️ Please enter a valid email address.' });
      return;
    }

    setContactStatus({ submitting: true, success: null, error: null });

    try {
      const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';
      const response = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setContactStatus({
          submitting: false,
          success: "✅ Message Sent Successfully! Thank you for contacting FarmCall. We've received your message and will get back to you soon.",
          error: null
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setContactStatus({
          submitting: false,
          success: null,
          error: data.error || "❌ Failed to send your message. Please try again later."
        });
      }
    } catch (err) {
      console.error(err);
      setContactStatus({
        submitting: false,
        success: null,
        error: "❌ Failed to send your message. Please try again later."
      });
    }
  };

  return (
    <div className="contact-page-container">
      <div className="container contact-container">
        <div className="contact-header text-center">
          <h2>Contact Us</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-form-col">
            <div className="contact-form-card card">
              <h3 className="form-title">Send Us a Message</h3>
              <div className="form-line-divider"></div>

              {contactStatus.success && (
                <div className="contact-alert success-alert">
                  {contactStatus.success}
                </div>
              )}

              {contactStatus.error && (
                <div className="contact-alert error-alert">
                  {contactStatus.error}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="contact-form-row">
                  <div className="form-group col-half">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="input-field"
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={handleContactChange}
                      disabled={contactStatus.submitting}
                      required
                    />
                  </div>

                  <div className="form-group col-half">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="input-field"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleContactChange}
                      disabled={contactStatus.submitting}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="input-field"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={handleContactChange}
                    disabled={contactStatus.submitting}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="input-field textarea-field"
                    placeholder="Your Message..."
                    rows="5"
                    value={formData.message}
                    onChange={handleContactChange}
                    disabled={contactStatus.submitting}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-primary cta-btn form-submit-btn"
                  disabled={contactStatus.submitting}
                >
                  {contactStatus.submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
