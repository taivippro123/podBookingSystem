import React from 'react';

export default function EnhancedAboutUs() {
  return (
    <div style={{ backgroundColor: 'white' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          height: '80vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200&ixlib=rb-4.0.3')",
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'black', opacity: 0.5 }}></div>
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
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', animation: 'fadeInDown 1s' }}>
            About Us
          </h1>
          <p style={{ fontSize: '1.5rem', maxWidth: '42rem', animation: 'fadeInUp 1s' }}>
            We are a team of dedicated professionals providing the best technological solutions for your business.
          </p>
          <button
            style={{
              marginTop: '2rem',
              backgroundColor: 'white',
              color: 'black',
              padding: '1rem 2rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            Discover Now
          </button>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ padding: '4rem 1rem', maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: '3rem', alignItems: 'center', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#3182ce' }}>
              Our Mission
            </h2>
            <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
              We are committed to providing advanced technological solutions and high-quality services to help your business grow and succeed in the digital age.
            </p>
            <button
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                border: '1px solid black',
                cursor: 'pointer',
                transition: 'transform 0.3s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateX(0.25rem)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
            >
              Learn More <span style={{ marginLeft: '0.5rem' }}>→</span>
            </button>
          </div>
          <div
            style={{
              aspectRatio: '16/9',
              backgroundColor: '#edf2f7',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
              transform: 'scale(1)',
              transition: 'transform 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800&ixlib=rb-4.0.3"
              alt="Our Mission"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ background: 'linear-gradient(to bottom, #ebf8ff, #ffffff)', padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '3rem', textAlign: 'center', color: '#3182ce' }}>
            Core Values
          </h2>
          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr 1fr' }}>
            {[
              { title: 'Innovation', description: 'Always seeking creative and advanced solutions', icon: '💡' },
              { title: 'Quality', description: 'Committed to delivering high-quality products and services', icon: '🏆' },
              { title: 'Customer Focus', description: 'Placing customers at the center of every decision', icon: '🤝' },
            ].map((value, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'box-shadow 0.3s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.2)')}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)')}
              >
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{value.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#3182ce' }}>
                  {value.title}
                </h3>
                <p style={{ color: '#718096' }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ padding: '4rem 1rem', maxWidth: '72rem', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '3rem', textAlign: 'center', color: '#3182ce' }}>
          Our Team
        </h2>
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
          {[
            { name: 'Nguyen Van A', role: 'CEO', image: 'https://i.pravatar.cc/300?img=1' },
            { name: 'Tran Thi B', role: 'CTO', image: 'https://i.pravatar.cc/300?img=2' },
            { name: 'Le Van C', role: 'COO', image: 'https://i.pravatar.cc/300?img=3' },
            { name: 'Pham Thi D', role: 'CFO', image: 'https://i.pravatar.cc/300?img=4' },
          ].map((member, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '10rem',
                  height: '10rem',
                  margin: '0 auto',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '50%',
                  marginBottom: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
                  transition: 'box-shadow 0.3s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 15px 20px rgba(0, 0, 0, 0.2)')}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)')}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#3182ce' }}>
                {member.name}
              </h3>
              <p style={{ color: '#718096' }}>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section style={{ backgroundColor: '#3182ce', color: 'white', padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>What Clients Say About Us</h2>
          <div style={{ backgroundColor: 'white', color: '#2d3748', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }}>
            <p style={{ fontSize: '1.25rem', fontStyle: 'italic', marginBottom: '1rem' }}>
              "Workflow helped us increase productivity by 200%. They truly understand business needs and offer excellent solutions."
            </p>
            <p style={{ fontWeight: 'bold' }}>- Tran Van E, Director of XYZ Company</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: 'linear-gradient(to right, #3182ce, #6b46c1)', color: 'white', padding: '4rem 1rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ready to Get Started?</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
            Contact us today to discover how we can help your business grow.
          </p>
          <button
            style={{
              padding: '1rem 2rem',
              backgroundColor: 'white',
              color: '#3182ce',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            Contact Now
          </button>
        </div>
      </section>
    </div>
  );
}
