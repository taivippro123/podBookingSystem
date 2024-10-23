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
    // const [userComfirmPassword, setUserComfirmPassword] = useState('');

    const [userPhone, setUserPhone] = useState('');
    const navigate = useNavigate();
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/signup', {
                userName,
                userEmail,
                userPassword,
                userPhone
            });
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 200 range
                console.error('Signup error', error.response.data);
                alert(error.response.data.error); // Show error to user
            } else if (error.request) {
                // Request was made but no response
                console.error('No response received:', error.request);
            } else {
                // Something else caused the error
                console.error('Error:', error.message);
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

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">


                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="name"
                                    autoComplete="name"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your name address"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your email address"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
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
                            {/* <div>
                                <label
                                    htmlFor="comfirm password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Comfirm Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="comfirm password"
                                        name="comfirm password"
                                        type={showPassword ? "text" : "comfirm password"}
                                        autoComplete="current-password"
                                        required
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Enter your comfirm password"
                                        value={userComfirmPassword}
                                        onChange={(e) => setUserComfirmPassword(e.target.value)}
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




                            </div> */}
                            <div>
                                <label
                                    htmlFor="Phone"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Phone
                                </label>
                                <input
                                    id="Phone"
                                    name="Phone"
                                    type="Phone"
                                    autoComplete="Phone"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your Phone address"
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
                        <div className="text-sm ">
                            <a class= "mx-2">
                            Already has account ?   
                            </a>
                            <a
                                href="/login"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Login
                            </a>
                        </div>
                    </form>
                </div>
            </div>
            {/* Left side - Office Image */}
            <div className="hidden lg:block lg:w-1/2">
                <img
                    src={bgImage}
                    alt="Modern office space"
                    className="object-cover w-full h-full"
                />
            </div>
        </div>
    );
};

export default Signup;
