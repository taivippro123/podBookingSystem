import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulating form submission logic, you can add your API request here
    const isFormValid = true; // Replace with actual validation logic

    if (isFormValid) {
      toast.success('Message sent successfully!');
    } else {
      toast.error('Failed to send the message. Please try again.');
    }
  };

  return (
    <div style={{ background: 'linear-gradient(to bottom, #ebf8ff, #ffffff)', minHeight: '100vh' }}>
      {/* Toast Container */}
      <ToastContainer />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          height: '40vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage:
            "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&q=80&w=1200&ixlib=rb-4.0.3')",
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(29, 78, 216, 0.7)' }}></div>
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Contact Us</h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '42rem' }}>
            We're always ready to listen and support you. Get in touch today!
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section style={{ padding: '4rem 1rem', maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: '3rem', alignItems: 'start', gridTemplateColumns: '1fr 1fr' }}>
          {/* Contact Form */}
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#3182ce' }}>Send us a message</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>
                  Full Name
                </label>
                <input
                  id="name"
                  placeholder="Enter your full name"
                  style={{
                    padding: '0.5rem',
                    width: '100%',
                    borderRadius: '0.25rem',
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>
              <div>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  style={{
                    padding: '0.5rem',
                    width: '100%',
                    borderRadius: '0.25rem',
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>
              <div>
                <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>
                  Phone Number
                </label>
                <input
                  id="phone"
                  placeholder="Enter your phone number"
                  style={{
                    padding: '0.5rem',
                    width: '100%',
                    borderRadius: '0.25rem',
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>
              <div>
                <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Enter your message"
                  rows={4}
                  style={{
                    padding: '0.5rem',
                    width: '100%',
                    borderRadius: '0.25rem',
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                ></textarea>
              </div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#3182ce',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '0.25rem',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2b6cb0')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3182ce')}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            {/* ... (rest of the contact info section) */}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* ... (rest of the FAQ section) */}

      {/* CTA Section */}
      {/* ... (rest of the CTA section) */}
    </div>
  );
}
