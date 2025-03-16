import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        address: '',
        country: '',
        youtube: '',
        username: '',
        password: '',
    })
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const fetchAvatar = async (id) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/auth/avatar?userId=${id}`);
            if (response.data.success) {
                localStorage.setItem('avatar', response.data.avatar);
            } else {
                localStorage.setItem('avatar', 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg');
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation
        if (formData.password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (!agreeTerms) {
            alert("Please agree to the terms and conditions");
            return;
        }

        console.log(formData)

        try {
            const response = await axios.post(`${BACKEND_URL}/auth/signup`, formData);
            if (response.data.success) {
                alert("Signup successful");
                await fetchAvatar(response.data.userId);
                localStorage.setItem('userId', response.data.userId);
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    return (
        <form className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-stone-300 mb-1">
                    Full Name
                </label>
                <input
                    type="text"
                    id="name"
                    onChange={handleChange}
                    value={formData.name}
                    className="w-full px-4 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all"
                    placeholder="John Doe"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    onChange={handleChange}
                    value={formData.email}
                    className="w-full px-4 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all"
                    placeholder="johndoe@example.com"
                />
            </div>

            <div>
                <label htmlFor="contact" className="block text-sm font-medium text-stone-300 mb-1">
                    Contact Number
                </label>
                <input
                    type="tel"
                    id="contact"
                    onChange={handleChange}
                    value={formData.contact}
                    className="w-full px-4 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all"
                    placeholder="+1 (555) 123-4567"
                />
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-stone-300 mb-1">
                    Address
                </label>
                <input
                    type="text"
                    id="address"
                    onChange={handleChange}
                    value={formData.address}
                    className="w-full px-4 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all"
                    placeholder="123 Main St, Apt 4B"
                />
            </div>

            <div>
                <label htmlFor="country" className="block text-sm font-medium text-stone-300 mb-1">
                    Country
                </label>
                <select
                    id="country"
                    onChange={handleChange}
                    value={formData.country}
                    className="w-full px-4 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all"
                >
                    <option value="" className="bg-stone-800">Select your country</option>
                    <option value="us" className="bg-stone-800">United States</option>
                    <option value="ca" className="bg-stone-800">Canada</option>
                    <option value="uk" className="bg-stone-800">United Kingdom</option>
                    <option value="au" className="bg-stone-800">Australia</option>
                    <option value="in" className="bg-stone-800">India</option>
                    <option value="other" className="bg-stone-800">Other</option>
                </select>
            </div>

            <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-stone-300 mb-1">
                    YouTube Channel Name
                </label>
                <input
                    type="text"
                    id="youtube"
                    onChange={handleChange}
                    value={formData.youtube}
                    className="w-full px-4 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all"
                    placeholder="My Awesome Channel"
                />
            </div>

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
                    placeholder="johndoe123"
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

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-300 mb-1">
                    Confirm Password
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    className="w-full px-4 py-2 rounded-lg bg-stone-800 border border-stone-700 text-white focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all"
                    placeholder="••••••••"
                />
            </div>

            <div className="flex items-center">
                <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-stone-600 bg-stone-800 focus:ring-stone-500"
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    checked={agreeTerms}
                />
                <label htmlFor="terms" className="ml-2 text-sm text-stone-400">
                    I agree to the <a href="#" className="text-stone-300 hover:text-white">Terms and Conditions</a>
                </label>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full py-3 px-4 bg-stone-600 hover:bg-stone-500 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-stone-900"
            >
                Create Account
            </button>
        </form>
    );
};

export default SignupForm;