import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GoogleSignupDetails = () => {
    const [formData, setFormData] = useState({
        email: "",
        contact: "",
        address: "",
        country: "",
        youtube: "",
        username: "",
        password: "",
        repeat_password: ""
    });
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [userId, setUserId] = useState(localStorage.getItem('userId'))

    useEffect(() => {
        // set email from url parameter
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        if (email) {
            setFormData(prevState => ({
                ...prevState,
                email: email
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.repeat_password) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.put(`${BACKEND_URL}/oauth/userinfo?userId=${userId}`, {
                data: formData
            });

            if (response.data.success) {
                const userId = response.data.userId
                localStorage.setItem('userId', userId)
                window.location.href = '/onboarding';
            } else {
                alert("Failed to update user info. Please try again.");
            }

        } catch (err) {
            console.error("Error updating user info:", err);
            alert("An error occurred. Please try again later.");
        }
    };


    return (
        <div className="min-h-screen bg-stone-900 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-stone-100">Trendly</h1>
                    <p className="text-stone-400 mt-2">Complete your profile to continue</p>
                </div>

                <div className="bg-stone-800 rounded-xl shadow-xl p-8 border border-stone-700">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-stone-300 text-sm font-medium mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-stone-700 text-stone-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-500 border border-stone-600"
                                    placeholder="Your email address"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-stone-300 text-sm font-medium mb-2" htmlFor="contact">
                                    Contact Number
                                </label>
                                <input
                                    id="contact"
                                    name="contact"
                                    type="tel"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    className="w-full bg-stone-700 text-stone-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-500 border border-stone-600"
                                    placeholder="Your contact number"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-stone-300 text-sm font-medium mb-2" htmlFor="address">
                                    Address
                                </label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-stone-700 text-stone-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-500 border border-stone-600"
                                    placeholder="Your address"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-stone-300 text-sm font-medium mb-2" htmlFor="country">
                                    Country
                                </label>
                                <select
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-stone-700 border border-stone-600 text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all"
                                    required
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
                                <label className="block text-stone-300 text-sm font-medium mb-2" htmlFor="youtube">
                                    YouTube Channel
                                </label>
                                <input
                                    id="youtube"
                                    name="youtube"
                                    type="text"
                                    value={formData.youtube}
                                    onChange={handleChange}
                                    className="w-full bg-stone-700 text-stone-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-500 border border-stone-600"
                                    placeholder="Your YouTube channel name"
                                />
                            </div>

                            <div>
                                <label className="block text-stone-300 text-sm font-medium mb-2" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full bg-stone-700 text-stone-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-500 border border-stone-600"
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-stone-300 text-sm font-medium mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-stone-700 text-stone-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-500 border border-stone-600"
                                    placeholder="Choose a password"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-stone-300 text-sm font-medium mb-2" htmlFor="repeat_password">
                                    Repeat Password
                                </label>
                                <input
                                    id="repeat_password"
                                    name="repeat_password"
                                    type="password"
                                    value={formData.repeat_password}
                                    onChange={handleChange}
                                    className="w-full bg-stone-700 text-stone-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-500 border border-stone-600"
                                    placeholder="Repeat the password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                className="w-full bg-stone-600 hover:bg-stone-500 text-stone-100 font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 transition duration-200 text-lg"
                            >
                                Complete Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GoogleSignupDetails;