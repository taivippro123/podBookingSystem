import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Layout, Input, Button, Typography, Card, message, Avatar } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, HomeOutlined, DollarTwoTone, DollarOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;

export default function Profile({ onProfileUpdate }) {
  const { userId: userIdParam } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    userPassword: '',
    userPoint: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const userId = userIdParam || localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    axios.get(`http://localhost:5000/profile/${userId}`)
      .then(response => {
        setProfile(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the profile!', error);
      });
  }, [userId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });

    // Reset error messages on input change
    if (name === 'userEmail') {
      setEmailError('');
    }
    if (name === 'userPhone') {
      setPhoneError('');
    }
    if (name === 'userPassword') {
        setPasswordError('');
      }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phonePattern = /^(0\d{9,10}|(\+84)\d{9,10})$/; // Must start with 0 or +84, followed by 9 to 10 digits
    return phonePattern.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (profile.userPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters long');
        return;
      }

    if (profile.userPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validateEmail(profile.userEmail)) {
      setEmailError('Invalid email format');
      return;
    }

    if (!validatePhoneNumber(profile.userPhone)) {
      setPhoneError('Phone number must start with 0 or +84 and contain 10 to 11 digits');
      return;
    }

    setError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');

    axios.put(`http://localhost:5000/profile/${userId}`, profile)
      .then(() => {
        message.success('Profile updated successfully!');

        // Update local storage with the new user data
        localStorage.setItem('user', JSON.stringify({ ...profile, userId }));

        // Call the callback to update the profile in ComHeader
        if (onProfileUpdate) {
          onProfileUpdate({ ...profile, userId });
        }

        setIsEditing(false);
        
        // Reload the page to reflect the changes
        window.location.reload();
      })
      .catch(() => {
        message.error('Failed to update profile.');
      });
  };

  return (
    <Layout style={{ minHeight: "100vh", background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Content style={{ padding: "24px 16px 0", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card
          style={{
            width: '100%',
            maxWidth: 500,
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            background: '#ffffff',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
            <Title level={2} style={{ margin: '16px 0 0', color: '#1890ff' }}>
              {isEditing ? 'Edit Personal Information' : 'Personal Information'}
            </Title>
          </div>
          {!isEditing ? (
            <div>
              <ProfileItem icon={<UserOutlined />} label="Full Name" value={profile.userName} />
              <ProfileItem icon={<MailOutlined />} label="Email" value={profile.userEmail} />
              <ProfileItem icon={<PhoneOutlined />} label="Phone" value={profile.userPhone} />
              <ProfileItem icon={<DollarOutlined />} label="Point" value={profile.userPoint} />
              <Button
                type="primary"
                onClick={() => setIsEditing(true)}
                style={{ marginTop: '20px', width: '100%', height: '40px', borderRadius: '20px' }}
              >
                Edit Profile
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FormItem icon={<UserOutlined />} label="Full Name" name="userName" value={profile.userName} onChange={handleInputChange} />
              <FormItem 
                icon={<MailOutlined />} 
                label="Email" 
                name="userEmail" 
                value={profile.userEmail} 
                onChange={handleInputChange} 
                type="email" 
                error={emailError} // Pass the email error to the form item
                
              />
              <FormItem 
                icon={<PhoneOutlined />} 
                label="Phone" 
                name="userPhone" 
                value={profile.userPhone} 
                onChange={handleInputChange} 
                error={phoneError} // Pass the phone error to the form item
              />
              <FormItem 
                icon={<LockOutlined />} 
                label="Password" 
                name="userPassword" 
                value={profile.userPassword} 
                onChange={handleInputChange} 
                isPassword 
                error={passwordError} // Pass the password error to the form item
              />
              <FormItem icon={<LockOutlined />} label="Confirm Password" value={confirmPassword} onChange={handleConfirmPasswordChange} isPassword />
              {error && <p style={{ color: '#ff4d4f', marginTop: '16px', marginBottom: '0' }}>{error}</p>} {/* Adjusted spacing for general error */}
              <Button type="primary" htmlType="submit" style={{ marginTop: '8px', height: '40px', borderRadius: '20px' }}>
                Save Changes
              </Button>
            </form>
          )}
          <Button
            icon={<HomeOutlined />}
            onClick={() => navigate('/home')}
            style={{ marginTop: '16px', width: '100%', height: '40px', borderRadius: '20px' }}
          >
            Back To Home
          </Button>
        </Card>
      </Content>
    </Layout>
  );
}

const ProfileItem = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
    {React.cloneElement(icon, { style: { fontSize: 20, marginRight: 8, color: '#1890ff' } })}
    <span style={{ fontWeight: 'bold', marginRight: 8, color: '#8c8c8c' }}>{label}:</span>
    <span>{value}</span>
  </div>
);

const FormItem = ({ icon, label, name, value, onChange, type = 'text', isPassword = false, error }) => (
  <div>
    <label style={{ fontWeight: 'bold', color: '#8c8c8c', display: 'block', marginBottom: 8 }}>
      {React.cloneElement(icon, { style: { marginRight: 8 } })}
      {label}:
    </label>
    <Input
      placeholder={`Enter your ${label.toLowerCase()}`}
      name={name}
      value={value}
      onChange={onChange}
      type={isPassword ? 'password' : type}
      style={{ borderRadius: '20px', height: '40px' }}
    />
    {error && <p style={{ color: '#ff4d4f', marginTop: '8px', marginBottom: '0' }}>{error}</p>} {/* Adjusted spacing for error message */}
  </div>
);
