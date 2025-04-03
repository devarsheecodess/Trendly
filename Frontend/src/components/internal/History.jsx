import React, { useState, useEffect } from 'react';
import { CalendarIcon, Clock, Film, FileText, Youtube, Image, Search, ChevronRight, Mic } from 'lucide-react';
import DetailPopup from './DetailPopup';
import axios from 'axios';

const History = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [activeTab, setActiveTab] = useState("all");
    const [userId, setUserId] = useState(localStorage.getItem("userId"));

    // Sample data for demonstration
    const [activities, setActivities] = useState({ scripts: [], voiceDubbings: [], thumbnails: [], seoAnalyses: [], youtubePosts: [] });

    const handleExport = async (e, url, id) => {
        e.preventDefault();
        if (!url) return;
        let link

        try {
            const response = await axios.get(`${BACKEND_URL}/thumbnail/download`, {
                params: { imageUrl: encodeURIComponent(url) },
                responseType: 'blob'
            });

            if (response.status !== 200) {
                throw new Error("Failed to download image");
            }

            const blob = new Blob([response.data], { type: 'image/png' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `thumbnail-${id}}.jpg`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error exporting thumbnail:', error.message);
        } finally {
            if (link) {
                URL.revokeObjectURL(link.href);
            }
        }
    };


    const formatDuration = (duration) => {
        const totalSeconds = parseFloat(duration); // Ensure it's a number

        if (isNaN(totalSeconds)) return "Unknown duration";

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        let formattedDuration = "";

        if (hours > 0) formattedDuration += `${hours} hrs `;
        if (minutes > 0) formattedDuration += `${minutes} mins `;
        if (seconds > 0 || formattedDuration === "") formattedDuration += `${seconds} secs`;

        return formattedDuration.trim();
    };

    const playvoiceover = (e, url) => {
        e.preventDefault();
        const audio = new Audio(url);
        audio.play();
    }

    const fetchScripts = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/history/scripts?id=${userId}`);
            if (response.data.success) {
                setActivities(prev => ({ ...prev, scripts: response.data.scripts }));
            }
        } catch (err) {
            console.log(err)
        }
    }

    const fetchSEOs = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/history/seos?id=${userId}`);
            if (response.data.success) {
                setActivities(prev => ({ ...prev, seoAnalyses: response.data.seos }));
            }
        } catch (err) {
            console.log(err)
        }
    }

    const fetchThumbnails = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/history/thumbnails?id=${userId}`);
            if (response.data.success) {
                setActivities(prev => ({ ...prev, thumbnails: response.data.thumbnails }));
            }
        } catch (err) {
            console.log(err)
        }
    }

    const fetchVoiceDubbings = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/history/voiceovers?id=${userId}`);
            if (response.data.success) {
                setActivities(prev => ({ ...prev, voiceDubbings: response.data.voiceovers }));
            }
        } catch (err) {
            console.log(err)
        }
    }

    const fetchYoutubePosts = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/history/youtube?id=${userId}`);
            if (response.data.success) {
                setActivities(prev => ({ ...prev, youtubePosts: response.data.videos }));
                console.log(response.data.videos)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchScripts();
        fetchSEOs();
        fetchThumbnails();
        fetchVoiceDubbings();
        fetchYoutubePosts();
    }, []);

    // Inside your History component, add the following state:
    const [detailPopup, setDetailPopup] = useState({
        isOpen: false,
        itemType: '',
        itemData: null
    });

    // Add this function to handle opening the popup
    const openDetailPopup = (type, data) => {
        setDetailPopup({
            isOpen: true,
            itemType: type,
            itemData: data
        });
    };

    // Add this function to handle closing the popup
    const closeDetailPopup = () => {
        setDetailPopup(prev => ({
            ...prev,
            isOpen: false
        }));
    };

    // Custom tab component
    const TabButton = ({ id, label, active, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${active
                ? "text-stone-800 border-b-2 border-stone-800 bg-stone-100"
                : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
                }`}
        >
            {label}
        </button>
    );

    const handleViewAll = (tab) => {
        setActiveTab(tab);
    };

    // Custom card component
    const ActivityCard = ({ children, className = "" }) => (
        <div className={`bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
            {children}
        </div>
    );

    // Function to render different content based on active tab
    const renderTabContent = () => {
        if (activeTab === "all") {
            return (
                <div className="space-y-8">
                    {/* Scripts Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-stone-800 flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-stone-600" />
                                Recent Scripts
                            </h2>
                            <button onClick={() => handleViewAll("scripts")} className="text-sm text-stone-600 hover:text-stone-800 flex items-center">
                                View all <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activities.scripts.slice(0, 3).map(script => (
                                <ActivityCard key={script.id}>
                                    <div className="p-4">
                                        <h3 className="font-medium text-stone-800 mb-2 truncate">{script.title}</h3>
                                        <div className="flex justify-between text-sm text-stone-500">
                                            <span>
                                                {new Date(script.createdAt).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                        <span className="text-sm text-stone-600"></span>
                                        <button
                                            className="text-sm text-stone-600 hover:text-stone-800"
                                            onClick={() => openDetailPopup('script', script)}
                                        >
                                            View
                                        </button>
                                    </div>
                                </ActivityCard>
                            ))}

                            {
                                activities.scripts.length === 0 && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 flex flex-col items-center justify-center text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
                                        <FileText className="h-12 w-12 text-stone-300 mb-3" />
                                        <p className="text-lg font-medium text-stone-500 mb-1">No scripts found</p>
                                        <p className="text-sm text-stone-400">Scripts you create will appear here</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    {/* Voice Dubbings Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-stone-800 flex items-center">
                                <Film className="h-5 w-5 mr-2 text-stone-600" />
                                Voice Dubbings
                            </h2>
                            <button onClick={() => handleViewAll("voiceDubbings")} className="text-sm text-stone-600 hover:text-stone-800 flex items-center">
                                View all <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activities.voiceDubbings.slice(0, 3).map(dubbing => (
                                <ActivityCard key={dubbing.id}>
                                    <div className="p-4">
                                        <h3 className="font-medium text-stone-800 mb-2 truncate">{dubbing.title}</h3>
                                        <div className="flex justify-between text-sm text-stone-500">
                                            <span>
                                                {new Date(dubbing.createdAt).toLocaleString("en-GB", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric"
                                                })}
                                            </span>
                                            <span>{formatDuration(dubbing.duration)}</span>
                                        </div>
                                    </div>
                                    <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                        <span className="text-sm text-stone-600">Voice: {dubbing.voice}</span>
                                        <button onClick={(e) => playvoiceover(e, dubbing.voiceover)} className="text-sm text-stone-600 hover:text-stone-800 flex items-center">
                                            <Clock className="h-4 w-4 mr-1" /> Play
                                        </button>
                                    </div>
                                </ActivityCard>
                            ))}

                            {
                                activities.voiceDubbings.length === 0 && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 flex flex-col items-center justify-center text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
                                        <Mic className="h-12 w-12 text-stone-300 mb-3" /> {/* Changed icon here */}
                                        <p className="text-lg font-medium text-stone-500 mb-1">No voiceovers found</p>
                                        <p className="text-sm text-stone-400">Voiceovers you create will appear here</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    {/* Thumbnails Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-stone-800 flex items-center">
                                <Image className="h-5 w-5 mr-2 text-stone-600" />
                                Thumbnails
                            </h2>
                            <button
                                onClick={() => handleViewAll("thumbnails")}
                                className="text-sm text-stone-600 hover:text-stone-800 flex items-center"
                            >
                                View all <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activities.thumbnails.slice(0, 3).map(thumbnail => (
                                <ActivityCard key={thumbnail._id}>
                                    <div className="relative overflow-hidden" style={{ paddingTop: "56.25%" }}>
                                        <img
                                            src={thumbnail.thumbnail}
                                            alt={`Thumbnail for ${thumbnail.title}`}
                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-stone-800 mb-2 truncate">{thumbnail.title}</h3>
                                        <div className="flex justify-between text-sm text-stone-500">
                                            <span>
                                                {new Date(thumbnail.createdAt).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                        <span className="text-sm text-stone-600"></span>
                                        <button onClick={(e) => handleExport(e, thumbnail.thumbnail, thumbnail._id)} className="text-sm text-stone-600 hover:text-stone-800">Download</button>
                                    </div>
                                </ActivityCard>
                            ))}

                            {
                                activities.thumbnails.length === 0 && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 flex flex-col items-center justify-center text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
                                        <Image className="h-12 w-12 text-stone-300 mb-3" /> {/* Changed icon here */}
                                        <p className="text-lg font-medium text-stone-500 mb-1">No thumbnails found</p>
                                        <p className="text-sm text-stone-400">Thumbnails you create will appear here</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>


                    {/* SEO Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-stone-800 flex items-center">
                                <Search className="h-5 w-5 mr-2 text-stone-600" />
                                SEO Analysis
                            </h2>
                            <button onClick={() => handleViewAll("seoAnalyses")} className="text-sm text-stone-600 hover:text-stone-800 flex items-center">
                                View all <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activities.seoAnalyses.slice(0, 3).map(seo => (
                                <ActivityCard key={seo._id}>
                                    <div className="p-4">
                                        <h3 className="font-medium text-stone-800 mb-2 truncate">{seo.optimizedTitle}</h3>
                                        <div className="flex justify-between text-sm text-stone-500">
                                            <span>
                                                {new Date(seo.createdAt).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="h-2 w-16 bg-stone-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${seo.titleScore > 75
                                                        ? "bg-green-500"
                                                        : seo.titleScore > 50
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                        }`}
                                                    style={{ width: `${seo.titleScore}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-stone-600 ml-2">{seo.titleScore}%</span>
                                        </div>
                                        <button
                                            className="text-sm text-stone-600 hover:text-stone-800"
                                            onClick={() => openDetailPopup('seo', seo)}
                                        >
                                            Details
                                        </button>
                                    </div>
                                </ActivityCard>
                            ))}

                            {
                                activities.seoAnalyses.length === 0 && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 flex flex-col items-center justify-center text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
                                        <Search className="h-12 w-12 text-stone-300 mb-3" /> {/* Changed icon here */}
                                        <p className="text-lg font-medium text-stone-500 mb-1">No SEO Analysis found</p>
                                        <p className="text-sm text-stone-400">SEO Analysis you do will appear here</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    {/* YouTube Posts Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-stone-800 flex items-center">
                                <Youtube className="h-5 w-5 mr-2 text-stone-600" />
                                YouTube Posts
                            </h2>
                            <button onClick={() => handleViewAll("youtubePosts")} className="text-sm text-stone-600 hover:text-stone-800 flex items-center">
                                View all <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activities.youtubePosts.slice(0, 3).map(post => (
                                <ActivityCard key={post._id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <div className="p-4">
                                        <div className="flex space-x-4">
                                            {/* Square thumbnail */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={post.thumbnail}
                                                    alt={post.title}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            </div>

                                            {/* Title and date */}
                                            <div className="flex-grow min-w-0">
                                                <h3 className="font-medium text-stone-800 mb-2 truncate">{post.title}</h3>
                                                <div className="text-sm text-stone-500">
                                                    <span>{new Date(post.createdAt).toLocaleDateString("en-GB", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric"
                                                    })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description or additional content can go here */}
                                        <div className="mt-4 text-sm text-stone-600 line-clamp-2">
                                            {post.description || "Watch this video on YouTube"}
                                        </div>
                                    </div>

                                    <div className="bg-stone-50 px-4 py-3 border-t border-stone-100 flex justify-between items-center">
                                        <a
                                            href={post.video}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-stone-600 hover:text-stone-800 flex items-center"
                                        >
                                            <span>Watch on YouTube</span>
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                </ActivityCard>
                            ))}

                            {
                                activities.youtubePosts.length === 0 && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 flex flex-col items-center justify-center text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
                                        <Youtube className="h-12 w-12 text-stone-300 mb-3" /> {/* Changed icon here */}
                                        <p className="text-lg font-medium text-stone-500 mb-1">No YouTube videos found</p>
                                        <p className="text-sm text-stone-400">Videos you post will appear here</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            );
        } else {
            // Render specific content for each tab
            const tabData = activities[activeTab] || [];
            const renderItems = () => {
                switch (activeTab) {
                    case "scripts":
                        return (
                            <>
                                {tabData.map(script => (
                                    <ActivityCard key={script.id} className="flex flex-col h-full">
                                        <div className="p-4 flex-grow">
                                            <h3 className="font-medium text-stone-800 mb-2">{script.title}</h3>
                                            <div className="flex justify-between text-sm text-stone-500">
                                                <span>
                                                    {new Date(script.createdAt).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                            <span className="text-sm text-stone-600"></span>
                                            <button
                                                className="text-sm text-stone-600 hover:text-stone-800"
                                                onClick={() => openDetailPopup('script', script)}
                                            >
                                                View
                                            </button>
                                        </div>
                                    </ActivityCard>
                                ))}

                                {/* Show "No scripts found" message only when there are no scripts */}
                                {activities.scripts.length === 0 && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 flex flex-col items-center justify-center text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
                                        <FileText className="h-12 w-12 text-stone-300 mb-3" />
                                        <p className="text-lg font-medium text-stone-500 mb-1">No scripts found</p>
                                        <p className="text-sm text-stone-400">Scripts you create will appear here</p>
                                    </div>
                                )}
                            </>
                        );
                    case "voiceDubbings":
                        return (
                            <>
                                {tabData.map(dubbing => (
                                    <ActivityCard key={dubbing.id} className="flex flex-col h-full">
                                        <div className="p-4 flex-grow">
                                            <h3 className="font-medium text-stone-800 mb-2">{dubbing.title}</h3>
                                            <div className="flex justify-between text-sm text-stone-500">
                                                <span>{new Date(dubbing.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</span>
                                                <span>{dubbing.duration}</span>
                                            </div>
                                        </div>
                                        <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                            <span className="text-sm text-stone-600">Voice: {dubbing.voice}</span>
                                            <button onClick={(e) => playvoiceover(e, dubbing.voiceover)} className="text-sm text-stone-600 hover:text-stone-800 flex items-center">
                                                <Clock className="h-4 w-4 mr-1" /> Play
                                            </button>
                                        </div>
                                    </ActivityCard>
                                ))}

                                {tabData.length === 0 && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 flex flex-col items-center justify-center text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
                                        <Mic className="h-12 w-12 text-stone-300 mb-3" />  {/* 🎙️ Microphone Icon */}
                                        <p className="text-lg font-medium text-stone-500 mb-1">No voiceovers found</p>
                                        <p className="text-sm text-stone-400">Voiceovers you create will appear here</p>
                                    </div>
                                )}
                            </>
                        );

                    case "thumbnails":
                        return (
                            <>
                                {tabData.map(thumbnail => (
                                    <ActivityCard key={thumbnail.id} className="flex flex-col h-full">
                                        <div className="relative overflow-hidden" style={{ paddingTop: "56.25%" }}>
                                            <img src={thumbnail.thumbnail} alt={thumbnail.title} className="absolute top-0 left-0 w-full h-full object-cover" />
                                        </div>
                                        <div className="p-4 flex-grow">
                                            <h3 className="font-medium text-stone-800 mb-2">{thumbnail.title}</h3>
                                            <div className="flex justify-between text-sm text-stone-500">
                                                <span>{new Date(thumbnail.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</span>
                                            </div>
                                        </div>
                                        <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                            <button onClick={(e) => handleExport(e, thumbnail.thumbnail, thumbnail._id)} className="text-sm text-stone-600 hover:text-stone-800">Download</button>
                                        </div>
                                    </ActivityCard>
                                ))}

                                {tabData.length === 0 && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 flex flex-col items-center justify-center text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
                                        <Image className="h-12 w-12 text-stone-300 mb-3" />  {/* 🖼️ Image Icon */}
                                        <p className="text-lg font-medium text-stone-500 mb-1">No thumbnails found</p>
                                        <p className="text-sm text-stone-400">Thumbnails you create will appear here</p>
                                    </div>
                                )}
                            </>
                        );

                    case "seoAnalyses":
                        return (
                            <>
                                {tabData.map(seo => (
                                    <ActivityCard key={seo.id} className="flex flex-col h-full">
                                        <div className="p-4 flex-grow">
                                            <h3 className="font-medium text-stone-800 mb-2">{seo.optimizedTitle}</h3>
                                            <div className="flex justify-between text-sm text-stone-500">
                                                <span>{new Date(seo.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</span>
                                                <span>{seo.primaryKeywords.length} keywords</span>
                                            </div>
                                        </div>
                                        <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="h-2 w-16 bg-stone-200 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${seo.titleScore > 75 ? "bg-green-500" : seo.titleScore > 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${seo.titleScore}%` }}></div>
                                                </div>
                                                <span className="text-sm text-stone-600 ml-2">{seo.titleScore}%</span>
                                            </div>
                                            <button className="text-sm text-stone-600 hover:text-stone-800" onClick={() => openDetailPopup('seo', seo)}>Details</button>
                                        </div>
                                    </ActivityCard>
                                ))}

                                {tabData.length === 0 && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 flex flex-col items-center justify-center text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
                                        <Search className="h-12 w-12 text-stone-300 mb-3" />
                                        <p className="text-lg font-medium text-stone-500 mb-1">No SEO Analysis found</p>
                                        <p className="text-sm text-stone-400">SEO Analysis you do will appear here</p>
                                    </div>
                                )}
                            </>
                        );

                    case "youtubePosts":
                        return (
                            <>
                                {tabData.map(post => (
                                    <ActivityCard key={post.id} className="flex flex-col h-full">
                                        <div className="p-4">
                                            <div className="flex space-x-4">
                                                <div className="flex-shrink-0">
                                                    <img src={post.thumbnail} alt={post.title} className="w-16 h-16 object-cover rounded-md" />
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <h3 className="font-medium text-stone-800 mb-2 truncate">{post.title}</h3>
                                                    <div className="text-sm text-stone-500">
                                                        <span>{new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 text-sm text-stone-600 line-clamp-2">{post.description || "Watch this video on YouTube"}</div>
                                        </div>
                                        <div className="bg-stone-50 px-4 py-3 border-t border-stone-100 flex justify-between items-center">
                                            <a href={post.video} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">Watch on YouTube</a>
                                        </div>
                                    </ActivityCard>
                                ))}

                                {tabData.length === 0 && (
                                    <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 flex flex-col items-center justify-center text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
                                        <Youtube className="h-12 w-12 text-stone-300 mb-3" />  {/* 🎥 Video Icon */}
                                        <p className="text-lg font-medium text-stone-500 mb-1">No YouTube posts found</p>
                                        <p className="text-sm text-stone-400">Your YouTube posts will appear here</p>
                                    </div>
                                )}
                            </>
                        );
                    default:
                        return <p>No data available.</p>;
                }
            };

            return (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-stone-800">
                            {activeTab === "scripts" && <FileText className="inline h-5 w-5 mr-2 text-stone-600" />}
                            {activeTab === "voiceDubbings" && <Film className="inline h-5 w-5 mr-2 text-stone-600" />}
                            {activeTab === "thumbnails" && <Image className="inline h-5 w-5 mr-2 text-stone-600" />}
                            {activeTab === "seoAnalyses" && <Search className="inline h-5 w-5 mr-2 text-stone-600" />}
                            {activeTab === "youtubePosts" && <Youtube className="inline h-5 w-5 mr-2 text-stone-600" />}
                            {activeTab === "scripts" && "All Scripts"}
                            {activeTab === "voiceDubbings" && "All Voice Dubbings"}
                            {activeTab === "thumbnails" && "All Thumbnails"}
                            {activeTab === "seoAnalyses" && "All SEO Analyses"}
                            {activeTab === "youtubePosts" && "All YouTube Posts"}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {renderItems()}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="md:ml-64 p-4 md:p-6 bg-stone-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-stone-800">History</h1>
                </div>

                <div className="border-b border-stone-200 mb-6">
                    <div className="flex overflow-x-auto pb-1">
                        <TabButton id="all" label="All Activity" active={activeTab === "all"} onClick={setActiveTab} />
                        <TabButton id="scripts" label="Scripts" active={activeTab === "scripts"} onClick={setActiveTab} />
                        <TabButton id="voiceDubbings" label="Voice Dubbings" active={activeTab === "voiceDubbings"} onClick={setActiveTab} />
                        <TabButton id="thumbnails" label="Thumbnails" active={activeTab === "thumbnails"} onClick={setActiveTab} />
                        <TabButton id="seoAnalyses" label="SEO Analysis" active={activeTab === "seoAnalyses"} onClick={setActiveTab} />
                        <TabButton id="youtubePosts" label="YouTube Posts" active={activeTab === "youtubePosts"} onClick={setActiveTab} />
                    </div>
                </div>

                {renderTabContent()}
            </div>
            <DetailPopup
                isOpen={detailPopup.isOpen}
                onClose={closeDetailPopup}
                itemType={detailPopup.itemType}
                itemData={detailPopup.itemData}
            />
        </div>
    );
};

export default History;