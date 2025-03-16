import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [id, setId] = useState(localStorage.getItem('userId'));
    const [google, setGoogle] = useState(localStorage.getItem('google'));
    const [isMobile, setIsMobile] = useState(false);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [avatar, setAvatar] = useState('');

    function getCookieValue(cookieName) {
        console.log(2);
        const cookies = document.cookie.split("; ");
        const cookie = cookies.find(row => row.startsWith(`${cookieName}=`));
        return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
    }

    const fetchAvatar = async (id) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/auth/avatar?userId=${id}`);
            if (response.data.success) {
                localStorage.setItem('avatar', response.data.avatar);
            } else {
                localStorage.setItem('avatar', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLMI5YxZE03Vnj-s-sth2_JxlPd30Zy7yEGg&s');
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchAvatar(getCookieValue("userId"));
        if (google && !id) {
            const userId = getCookieValue("userId");
            localStorage.setItem('userId', userId);
            const username = getCookieValue("userName");
            localStorage.setItem('username', username);
            setId(userId);
        }

        // Check if viewport is mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className={`bg-stone-50 min-h-screen ${isMobile ? 'ml-0' : 'ml-0 md:ml-64'} transition-all duration-300`}>
            <div className="p-4 md:p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-xl md:text-2xl font-bold text-stone-800">Welcome to your Dashboard</h1>
                        <p className="text-stone-500 mt-1">User ID: {id || "Not logged in"}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow p-4 md:p-6 border border-stone-100">
                            <div className="flex items-center mb-3 md:mb-4">
                                <div className="bg-stone-100 p-2 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-base md:text-lg font-medium text-stone-800 ml-3">Total Views</h2>
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-stone-800">32.4K</p>
                            <p className="text-xs md:text-sm text-stone-500 mt-1">+12% from last week</p>
                        </div>

                        {/* Subscribers */}
                        <div className="bg-white rounded-lg shadow p-4 md:p-6 border border-stone-100">
                            <div className="flex items-center mb-3 md:mb-4">
                                <div className="bg-stone-100 p-2 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-base md:text-lg font-medium text-stone-800 ml-3">Subscribers</h2>
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-stone-800">2.7K</p>
                            <p className="text-xs md:text-sm text-stone-500 mt-1">+3.2% from last month</p>
                        </div>

                        {/* Revenue */}
                        <div className="bg-white rounded-lg shadow p-4 md:p-6 border border-stone-100">
                            <div className="flex items-center mb-3 md:mb-4">
                                <div className="bg-stone-100 p-2 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-base md:text-lg font-medium text-stone-800 ml-3">Revenue</h2>
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-stone-800">$748</p>
                            <p className="text-xs md:text-sm text-stone-500 mt-1">+8.1% from last month</p>
                        </div>
                    </div>

                    {/* Recent Content */}
                    <div className="mt-6 md:mt-8 bg-white rounded-lg shadow p-4 md:p-6 border border-stone-100">
                        <h2 className="text-lg md:text-xl font-bold text-stone-800 mb-4">Recent Content</h2>
                        <div className="overflow-x-auto -mx-4 md:mx-0">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden border border-stone-200 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-stone-200">
                                        <thead className="bg-stone-50">
                                            <tr>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Title</th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Views</th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-stone-200">
                                            <tr>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-stone-800">How to Create Viral Content</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-500">12.5K</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Published</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-500">Mar 10</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-stone-800">Top 10 SEO Tips</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-500">8.3K</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Published</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-500">Mar 5</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-stone-800">Camera Equipment Review</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-500">6.7K</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Scheduled</span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-500">Mar 18</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;