import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profile() {
    const { userId } = useParams();  // Get the userId from the URL
    const [profile, setProfile] = useState({
        userName: '',
        userEmail: '',
        userPhone: '',
        userPassword: '',
        userPoint: 0
    });
    const [isEditing, setIsEditing] = useState(false); // Track whether the form is in edit mode
    const [message, setMessage] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // Fetch user's profile when component mounts
    useEffect(() => {
        axios.get(`http://localhost:5000/profile/${userId}`)
            .then(response => {
                setProfile(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the profile!', error);
            });
    }, [userId]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    // Handle confirm password change
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate password and confirm password
        if (profile.userPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Clear error if passwords match
        setError('');

        axios.put(`http://localhost:5000/profile/${userId}`, profile)
            .then(response => {
                setMessage('Profile updated successfully!');
                setIsEditing(false);  // Exit edit mode
            })
            .catch(error => {
                console.error('There was an error updating the profile!', error);
                setMessage('Failed to update profile.');
            });
    };

    return (
        <div className="profile-container">
            <h2>Your Profile</h2>
            {!isEditing ? (
                <>
                    <div>
                        <p><strong>Name:</strong> {profile.userName}</p>
                        <p><strong>Email:</strong> {profile.userEmail}</p>
                        <p><strong>Phone:</strong> {profile.userPhone}</p>
                        <p><strong>Points:</strong> {profile.userPoint}</p>
                        <button onClick={() => setIsEditing(true)}>Update Profile</button>
                    </div>
                </>
            ) : (
                <>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Name:</label>
                            <input 
                                type="text" 
                                name="userName" 
                                value={profile.userName} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input 
                                type="email" 
                                name="userEmail" 
                                value={profile.userEmail} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label>Phone:</label>
                            <input 
                                type="text" 
                                name="userPhone" 
                                value={profile.userPhone} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input 
                                type="password" 
                                name="userPassword" 
                                value={profile.userPassword} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label>Confirm Password:</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={handleConfirmPasswordChange} 
                                required 
                            />
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
                        <button type="submit">Update Profile</button>
                    </form>
                </>
            )}
            {message && <p>{message}</p>} {/* Display success or error message */}
        </div>
    );
}

export default Profile;
