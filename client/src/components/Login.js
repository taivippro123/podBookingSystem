import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';  // Import named export
import { auth, provider } from './config';
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const navigate = useNavigate();

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                localStorage.setItem('email', user.email);
                localStorage.setItem('user', JSON.stringify({
                    userEmail: user.email,
                    userName: user.displayName,
                    userRole: 4 // Assuming Google sign-in users are customers by default
                }));
                navigate('/customer'); // Navigate to customer page after Google sign-in
            })
            .catch((error) => {
                console.error('Google login error:', error);
                alert('Google sign-in failed. Please try again.');
            });
    }

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Use named export jwtDecode
                const currentTime = Date.now() / 1000; // Convert to seconds

                if (decodedToken.exp < currentTime) {
                    // Token is expired, clear the storage and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                } else {
                    const user = JSON.parse(localStorage.getItem('user'));
                    if (user && user.userRole) {
                        navigateBasedOnRole(user.userRole);
                    }
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    }, [navigate]);

    const navigateBasedOnRole = (userRole) => {
        switch (userRole) {
            case 1:
                navigate('/admin');
                break;
            case 2:
                navigate('/manager');
                break;
            case 3:
                navigate('/staff');
                break;
            case 4:
            default:
                navigate('/customer');
                break;
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login attempt with:', { userEmail, userPassword });

        axios.post('http://localhost:5000/login', { userEmail, userPassword })
            .then(response => {
                console.log('Full login response:', response.data);
                const { token, user } = response.data;

                // Store the token and user data in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                console.log('Token and user data stored in localStorage:', JSON.parse(localStorage.getItem('user')));

                navigateBasedOnRole(user.userRole);
            })
            .catch(err => {
                console.error('Login error:', err);
                alert('Login failed. Please check your email and password.');
            });
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h1>Login</h1>
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
                <p className="signup-link">
                    Don't have an account? <span onClick={() => navigate('/signup')}>Sign up</span>
                </p>
                <p className='p-login'>OR</p>
                <div className="google-signin-container">
                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="google-signin-button"
                    >
                        <img src={process.env.PUBLIC_URL + '/img/google-logo.png'} alt="Google logo" className="google-logo" />
                        Sign in with Google
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
