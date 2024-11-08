import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/login.png';
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const validatePhone = (phone) => /^0\d{9}$/.test(phone);  // Regex to ensure phone starts with 0 and has 10 digits

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation checks
        if (!validatePhone(userPhone)) {
            setNotification({ message: "Phone number must start with 0 and be 10 digits.", type: "error" });
            return;
        }
        if (userPassword.length < 6) {
            setNotification({ message: "Password must be at least 6 characters long.", type: "error" });
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/signup', {
                userName,
                userEmail,
                userPassword,
                userPhone
            });
            console.log(response.data);
            setNotification({ message: "Signup successful!", type: "success" });
            setTimeout(() => navigate('/login'), 2000);  // Navigate to login after showing success message
        } catch (error) {
            if (error.response) {
                console.error('Signup error', error.response.data);
                setNotification({ message: error.response.data.error, type: "error" });
            } else if (error.request) {
                console.error('No response received:', error.request);
                setNotification({ message: "No response from server. Please try again.", type: "error" });
            } else {
                console.error('Error:', error.message);
                setNotification({ message: "An error occurred. Please try again.", type: "error" });
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '5rem',
                                height: '5rem',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #6a5acd, #ff7f50)',
                                marginBottom: '1rem',
                            }}
                        >
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff' }}>WZ</span>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Signup
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Let's create your account
                        </p>
                    </div>

                    {notification && (
                        <div
                            className={`p-2 mb-4 text-center text-sm rounded ${
                                notification.type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                            }`}
                        >
                            {notification.message}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your email address"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Enter your password"
                                        value={userPassword}
                                        onChange={(e) => setUserPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="Phone" className="block text-sm font-medium text-gray-700">
                                    Phone
                                </label>
                                <input
                                    id="Phone"
                                    name="Phone"
                                    type="text"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your phone number"
                                    value={userPhone}
                                    onChange={(e) => setUserPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                SIGN UP
                            </button>
                        </div>
                        <div className="text-sm">
                            <span className="mx-2">Already have an account?</span>
                            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Login
                            </a>
                        </div>
                    </form>
                </div>
            </div>
            <div className="hidden lg:block lg:w-1/2">
                <img src={bgImage} alt="Modern office space" className="object-cover w-full h-full" />
            </div>
        </div>
    );
};

export default Signup;
