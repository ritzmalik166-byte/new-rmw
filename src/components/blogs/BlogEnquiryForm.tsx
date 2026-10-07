"use client";

import { useState } from "react";

export function BlogEnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Quick client feedback
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  if (submitted) {
    return (
      <div className="blog-enquiry-card is-success">
        <div className="enquiry-success-icon">✓</div>
        <h4 className="enquiry-success-title">Thank You!</h4>
        <p className="enquiry-success-text">
          Your enquiry has been received. We will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", phone: "", message: "" });
          }}
          className="enquiry-reset-btn"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="blog-enquiry-card">
      <div className="enquiry-card-header">
        <h3 className="enquiry-card-title">Quick Enquiry</h3>
        <p className="enquiry-card-subtitle">Have a project? Let&apos;s discuss.</p>
      </div>

      <form onSubmit={handleSubmit} className="enquiry-form">
        <div className="enquiry-field">
          <input
            type="text"
            required
            placeholder="Your Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="enquiry-input"
          />
        </div>

        <div className="enquiry-field">
          <input
            type="email"
            required
            placeholder="Your Email *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="enquiry-input"
          />
        </div>

        <div className="enquiry-field">
          <input
            type="tel"
            required
            placeholder="Phone Number *"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="enquiry-input"
          />
        </div>

        <div className="enquiry-field">
          <textarea
            required
            rows={2}
            placeholder="Brief requirements..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="enquiry-textarea"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="enquiry-submit-btn"
        >
          {loading ? "Sending..." : "Submit Enquiry"}
        </button>
      </form>
    </div>
  );
}
