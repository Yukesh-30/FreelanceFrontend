import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../service/axiosInstance';
import { API_PATH } from '../service/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password });

        try {
            const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, { email, password });
            console.log('Login successful:', response.data);

            const token = response.data.token; // Assuming API returns { token: "..." }
            if (token) {
                const decodedUser = login(token);
                console.log('Decoded user:', decodedUser);
                if (decodedUser) {
                    if (decodedUser.role === 'CLIENT') {
                        navigate('/client/dashboard');
                    } else if (decodedUser.role === 'FREELANCER') {
                        navigate('/freelancer/dashboard');
                    } else {
                        navigate('/');
                    }
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert("Login failed. Please checks your credentials.");
        }
    };

    const handleForgetPassword = async () => {
        if (!email) {
            alert("Please enter your email to reset password");
            return;
        }
        try {
            const response = await axiosInstance.post(API_PATH.AUTH.FORGET_PASSWORD, { email });
            console.log('Forget password email sent:', response.data);
            alert("Mail sent successfully");
        } catch (error) {
            console.error('Forget password failed:', error);
            alert("Failed to send reset email. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center mb-6">
                    <span className="text-4xl font-serif font-bold text-black tracking-tight">
                        SkillSphere<span className="text-gray-400">.</span>
                    </span>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 font-serif">
                    Welcome back
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Please enter your details to sign in.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-100 sm:rounded-2xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-colors"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm transition-colors"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={handleForgetPassword}
                                    className="font-medium text-gray-600 hover:text-black transition-colors bg-transparent border-none cursor-pointer"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Don't have an account?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link to="/signup" className="text-black font-medium hover:text-gray-800 transition-colors">
                                Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
