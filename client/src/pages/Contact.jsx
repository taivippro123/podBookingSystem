import React from 'react';

export default function Contact() {
  return (
    <div style={{ background: 'linear-gradient(to bottom, #ebf8ff, #ffffff)', minHeight: '100vh' }}>
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
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#3182ce' }}>Contact Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'start' }}>
                <span style={{ marginRight: '1rem', fontSize: '1.5rem', color: '#3182ce' }}>📞</span>
                <div>
                  <h3 style={{ fontWeight: '600' }}>Phone</h3>
                  <p style={{ color: '#4a5568' }}>+84 123 456 789</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'start' }}>
                <span style={{ marginRight: '1rem', fontSize: '1.5rem', color: '#3182ce' }}>✉️</span>
                <div>
                  <h3 style={{ fontWeight: '600' }}>Email</h3>
                  <p style={{ color: '#4a5568' }}>info@WorkZoneBooking.com.vn</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'start' }}>
                <span style={{ marginRight: '1rem', fontSize: '1.5rem', color: '#3182ce' }}>📍</span>
                <div>
                  <h3 style={{ fontWeight: '600' }}>Address</h3>
                  <p style={{ color: '#4a5568' }}>Số 10, Lô 26, Đường số 3, Khu phần mềm Quang Trung, Phường Tân Chánh Hiệp, Quận 12, Thành phố Hồ Chí Minh</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'start' }}>
                <span style={{ marginRight: '1rem', fontSize: '1.5rem', color: '#3182ce' }}>⏰</span>
                <div>
                  <h3 style={{ fontWeight: '600' }}>Working Hours</h3>
                  <p style={{ color: '#4a5568' }}>Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p style={{ color: '#4a5568' }}>Saturday: 8:00 AM - 12:00 PM</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#3182ce' }}>Map</h2>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4946681007846!2d106.70093601533417!3d10.773374962177693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc7%3A0x4db964d76bf6e18e!2sIndependence%20Palace!5e0!3m2!1sen!2s!4v1635774243689!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0, border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '4rem 1rem', backgroundColor: '#ebf8ff' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: '#3182ce' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              {
                q: 'How can I schedule an appointment?',
                a: 'You can schedule an appointment by calling us or sending an email. We will respond within 24 hours.',
              },
              {
                q: 'Do you offer 24/7 customer support?',
                a: 'We provide support during business hours. For emergencies, we have a 24/7 hotline available.',
              },
              {
                q: 'How can I request a quote?',
                a: 'You can request a quote by filling out the contact form on our website or by sending an email directly to our sales department.',
              },
            ].map((faq, index) => (
              <div key={index} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#3182ce' }}>{faq.q}</h3>
                <p style={{ color: '#4a5568' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: '#3182ce', color: 'white', padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ready to get started?</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Contact us today to discover how we can help your business grow.</p>
          <button
            style={{
              padding: '1rem 2rem',
              backgroundColor: 'white',
              color: '#3182ce',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '0.25rem',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            Schedule a Free Consultation
          </button>
        </div>
      </section>
    </div>
  );
}
