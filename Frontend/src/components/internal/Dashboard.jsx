import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [id, setId] = useState(localStorage.getItem('userId'));
    const [youtube, setYoutube] = useState(localStorage.getItem('youtube'));
    const [google, setGoogle] = useState(localStorage.getItem('google'));
    const [isMobile, setIsMobile] = useState(false);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [avatar, setAvatar] = useState('');
    const [contentData, setContentData] = useState({
        recentProjects: [],
        voiceoverStats: { completed: 0 },
        thumbnailStats: { generated: 0 },
        scriptStats: { completed: 0 },
        SEOStats: { completed: 0 },
        videoStats: { posted: 0 }
    });

    // Trending topics data
    const [trendingTopics, setTrendingTopics] = useState([]);
    const [loading, setLoading] = useState(false); // Loader state

    function getCookieValue(cookieName) {
        const cookies = document.cookie.split("; ");
        const cookie = cookies.find(row => row.startsWith(`${cookieName}=`));
        return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
    }

    const fetchAvatar = async (id) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/auth/avatar?userId=${id}`);
            if (response.data.success) {
                localStorage.setItem('avatar', response.data.avatar);
                setAvatar(response.data.avatar);
            } else {
                localStorage.setItem('avatar', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLMI5YxZE03Vnj-s-sth2_JxlPd30Zy7yEGg&s');
                setAvatar('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLMI5YxZE03Vnj-s-sth2_JxlPd30Zy7yEGg&s');
            }
        } catch (err) {
            console.error(err);
        }
    }

    const fetchUserContentData = async () => {
        try {
            console.log(id)
            const response = await axios.get(`${BACKEND_URL}/dashboard/stats?id=${id}`);
            if (response.data.success) {
                setContentData({
                    voiceoverStats: { completed: response.data.data.voiceoverStats },
                    thumbnailStats: { generated: response.data.data.thumbnailStats },
                    scriptStats: { completed: response.data.data.scriptStats },
                    SEOStats: { completed: response.data.data.SEOStats },
                    videoStats: { posted: response.data.data.videoStats },
                    recentProjects: response.data.data.recentProjects
                });
            }
        } catch (err) {
            console.error('Error fetching user content data:', err);
        }
    }

    const fetchTrendingTopics = async () => {
        try {
            setLoading(true); // Set loading to true before fetching
            const response = await axios.get(`${BACKEND_URL}/prompt/trending_topics?id=${id}`);

            if (response.data?.response) {
                // Remove the code block formatting (```json and ```)
                const cleanedResponse = response.data.response.replace(/```json\n|\n```/g, "");

                // Parse the cleaned JSON string
                const parsedData = JSON.parse(cleanedResponse);

                if (Array.isArray(parsedData)) {
                    setTrendingTopics(parsedData);
                    setLoading(false); // Set loading to false after fetching
                } else {
                    console.error("Parsed data is not an array:", parsedData);
                }
            } else {
                console.error("Invalid response format:", response.data);
            }
        } catch (err) {
            console.log("Error fetching trending topics:", err);
        }
    };

    const fetchChannelName = async (id) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/auth/channel?userId=${id}`);
            if (response.data.success) {
                localStorage.setItem('youtube', response.data.youtube);
            } else {
                localStorage.setItem('youtube', '');
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (google && !id) {
            const urlParams = new URLSearchParams(window.location.search);

            const userData = {
                userName: decodeURIComponent(urlParams.get("userName")),
                userId: urlParams.get("userId"),
                avatar: decodeURIComponent(urlParams.get("avatar"))
            };
            localStorage.setItem('userId', userData.userId);
            fetchChannelName(userData.userId);
            fetchAvatar(userData.userId);
            localStorage.setItem('username', userData.userName);
            setId(userData.userId);
        }

        fetchAvatar(id);
        fetchUserContentData();
        fetchTrendingTopics();

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
                        <p className="text-stone-500 mt-1">{youtube}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
                        {/* Voice Over Stats */}
                        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 border border-stone-100">
                            <div className="flex items-center mb-3 md:mb-4">
                                <div className="bg-purple-100 p-2 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                                <h2 className="text-base md:text-lg font-medium text-stone-800 ml-3">Voice Overs</h2>
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-stone-800">{contentData.voiceoverStats.completed}</p>
                            <div className="flex justify-between text-xs md:text-sm text-stone-500 mt-1">
                                <span>Completed</span>
                            </div>
                        </div>

                        {/* Thumbnail Stats */}
                        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 border border-stone-100">
                            <div className="flex items-center mb-3 md:mb-4">
                                <div className="bg-green-100 p-2 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-base md:text-lg font-medium text-stone-800 ml-3">Thumbnails</h2>
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-stone-800">{contentData.thumbnailStats.generated}</p>
                            <div className="flex justify-between text-xs md:text-sm text-stone-500 mt-1">
                                <span>Generated</span>
                            </div>
                        </div>

                        {/* Script Stats */}
                        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 border border-stone-100">
                            <div className="flex items-center mb-3 md:mb-4">
                                <div className="bg-blue-100 p-2 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h2 className="text-base md:text-lg font-medium text-stone-800 ml-3">Scripts</h2>
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-stone-800">{contentData.scriptStats.completed}</p>
                            <div className="flex justify-between text-xs md:text-sm text-stone-500 mt-1">
                                <span>Completed</span>
                            </div>
                        </div>

                        {/* SEO Stats */}
                        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 border border-stone-100">
                            <div className="flex items-center mb-3 md:mb-4">
                                <div className="bg-yellow-100 p-2 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h2 className="text-base md:text-lg font-medium text-stone-800 ml-3">SEO</h2>
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-stone-800">{contentData.SEOStats.completed}</p>
                            <div className="flex justify-between text-xs md:text-sm text-stone-500 mt-1">
                                <span>Optimized</span>
                            </div>
                        </div>

                        {/* Video Posts Stats */}
                        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 border border-stone-100">
                            <div className="flex items-center mb-3 md:mb-4">
                                <div className="bg-red-100 p-2 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-base md:text-lg font-medium text-stone-800 ml-3">Videos</h2>
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-stone-800">{contentData.videoStats.posted}</p>
                            <div className="flex justify-between text-xs md:text-sm text-stone-500 mt-1">
                                <span>Posted</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Content Projects */}
                    <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 border border-stone-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg md:text-xl font-bold text-stone-800">Recent Projects</h2>
                        </div>
                        <div className="overflow-x-auto -mx-4 md:mx-0">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden border border-stone-200 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-stone-200">
                                        <thead className="bg-stone-50">
                                            <tr>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Project</th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Visibility</th>
                                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-stone-200">
                                            {contentData.recentProjects.map((project, index) => (
                                                <tr key={index} className="hover:bg-stone-50 transition-colors">
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img className="h-10 w-10 rounded object-cover" src={project.thumbnail} alt="" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-stone-800">{project.title}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <StatusBadge status={project.privacy} />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-500">{project.date}</td>
                                                </tr>
                                            ))}

                                            {
                                                contentData.recentProjects.length === 0 && (
                                                    <tr>
                                                        <td colSpan="3" className="px-4 py-3 text-center text-sm text-stone-500">No recent projects found.</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trending Topics Section - SIMPLIFIED */}
                    <div className="mt-6 md:mt-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 md:p-7 border border-stone-200">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg md:text-xl font-semibold text-stone-900">Content Suggestions</h2>
                            <span className="bg-indigo-100 text-indigo-600 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
                                ✨ AI recommended
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-5">
                                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {trendingTopics.map((topic, index) => (
                                    <li key={index} className="flex justify-between items-center py-3 border-b border-stone-200 last:border-b-0">
                                        <div>
                                            <h3 className="font-medium text-stone-900">{topic.topic}</h3>
                                        </div>
                                        <div className="text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                            {topic.popularity}% Hot
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component for status badges
const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-800";

    switch (status) {
        case "private":
            bgColor = "bg-red-100";
            textColor = "text-red-800";
            break;
        case "public":
            bgColor = "bg-green-100";
            textColor = "text-green-800";
            break;
        case "unlisted":
            bgColor = "bg-orange-100";
            textColor = "text-orange-800";
            break;
    }

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
            {status}
        </span>
    );
};

export default Dashboard;