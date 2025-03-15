import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BACKEND_URL}/auth/login`, formData);
            if (response.data.success) {
                alert("Login successful");
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('username', response.data.name);
                window.location.href = '/dashboard';
            } else {
                alert(response.data.message);
            }

            if (response.status === 404) {
                alert("User not found");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleGoogleLogin = async () => {
        localStorage.setItem("google", true)
        window.location.href = `${BACKEND_URL}/oauth/user/login/google`;
    }

    return (
        <form className="space-y-4">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-stone-300 mb-1">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    onChange={handleChange}
                    value={formData.username}
                    className="w-full px-4 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all"
                    placeholder="Enter your username"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-stone-300 mb-1">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    onChange={handleChange}
                    value={formData.password}
                    className="w-full px-4 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all"
                    placeholder="••••••••"
                />
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <input
                        id="remember"
                        type="checkbox"
                        className="h-4 w-4 rounded border-stone-600 bg-stone-800 focus:ring-stone-500"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-stone-400">
                        Remember me
                    </label>
                </div>
                <a href="#" className="text-sm text-stone-400 hover:text-white transition-colors">
                    Forgot password?
                </a>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full py-3 px-4 bg-stone-600 hover:bg-stone-500 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-stone-900"
            >
                Login
            </button>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-stone-900 text-stone-400">or continue with</span>
                </div>
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center py-3 px-4 bg-stone-800 hover:bg-stone-700 text-white font-medium rounded-lg border border-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500"
            >
                <FcGoogle className="w-5 h-5 mr-2" />
                Sign in with Google
            </button>
        </form>
    );
};

export default LoginForm;