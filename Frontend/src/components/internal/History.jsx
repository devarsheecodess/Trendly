import React, { useState } from 'react';
import { CalendarIcon, Clock, Film, FileText, Youtube, Image, Search, ChevronRight } from 'lucide-react';

const History = () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [activeTab, setActiveTab] = useState("all");

    // Sample data for demonstration
    const activities = {
        scripts: [
            { id: 1, title: "How to Cook Perfect Pasta", date: "Mar 15, 2025", status: "Completed", wordCount: 856 },
            { id: 2, title: "Top 10 Travel Destinations 2025", date: "Mar 12, 2025", status: "Completed", wordCount: 1243 },
            { id: 3, title: "AI in Everyday Life", date: "Mar 10, 2025", status: "Completed", wordCount: 976 },
        ],
        voiceDubbings: [
            { id: 1, title: "Product Review Narration", date: "Mar 14, 2025", duration: "4:32", voice: "Emma" },
            { id: 2, title: "Tutorial Voice Over", date: "Mar 11, 2025", duration: "8:15", voice: "James" },
            { id: 3, title: "Documentary Narration", date: "Mar 8, 2025", duration: "12:45", voice: "David" },
        ],
        thumbnails: [
            { id: 1, title: "Summer Vlog Thumbnail", date: "Mar 16, 2025", dimensions: "1280x720", previewUrl: "/api/placeholder/192/108" },
            { id: 2, title: "Product Review Thumbnail", date: "Mar 13, 2025", dimensions: "1280x720", previewUrl: "/api/placeholder/192/108" },
            { id: 3, title: "Tutorial Series Thumbnail", date: "Mar 9, 2025", dimensions: "1280x720", previewUrl: "/api/placeholder/192/108" },
        ],
        seoAnalyses: [
            { id: 1, title: "Gaming Channel Optimization", date: "Mar 15, 2025", score: 92, keywords: 14 },
            { id: 2, title: "Cooking Content Analysis", date: "Mar 12, 2025", score: 87, keywords: 18 },
            { id: 3, title: "Travel Vlog SEO Review", date: "Mar 8, 2025", score: 84, keywords: 12 },
        ],
        youtubePosts: [
            { id: 1, title: "My Morning Routine 2025", date: "Mar 14, 2025", views: 4325, likes: 512, url: "youtu.be/abc123" },
            { id: 2, title: "Honest Review: Latest Tech", date: "Mar 10, 2025", views: 8761, likes: 943, url: "youtu.be/def456" },
            { id: 3, title: "How I Built My Home Studio", date: "Mar 6, 2025", views: 12453, likes: 1832, url: "youtu.be/ghi789" },
        ]
    };

    const getTimeAgo = (dateStr) => {
        // This would normally calculate actual time difference
        // For demo purposes, returning placeholder text
        return "3 days ago";
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
                                            <span>{script.date}</span>
                                            <span>{script.wordCount} words</span>
                                        </div>
                                    </div>
                                    <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                        <span className="text-sm text-stone-600">{script.status}</span>
                                        <button className="text-sm text-stone-600 hover:text-stone-800">View</button>
                                    </div>
                                </ActivityCard>
                            ))}
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
                                            <span>{dubbing.date}</span>
                                            <span>{dubbing.duration}</span>
                                        </div>
                                    </div>
                                    <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                        <span className="text-sm text-stone-600">Voice: {dubbing.voice}</span>
                                        <button className="text-sm text-stone-600 hover:text-stone-800 flex items-center">
                                            <Clock className="h-4 w-4 mr-1" /> Play
                                        </button>
                                    </div>
                                </ActivityCard>
                            ))}
                        </div>
                    </div>

                    {/* Thumbnails Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-stone-800 flex items-center">
                                <Image className="h-5 w-5 mr-2 text-stone-600" />
                                Thumbnails
                            </h2>
                            <button onClick={() => handleViewAll("thumbnails")} className="text-sm text-stone-600 hover:text-stone-800 flex items-center">
                                View all <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activities.thumbnails.slice(0, 3).map(thumbnail => (
                                <ActivityCard key={thumbnail.id}>
                                    <div className="relative overflow-hidden" style={{ paddingTop: "56.25%" }}>
                                        <img
                                            src={thumbnail.previewUrl}
                                            alt={thumbnail.title}
                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-stone-800 mb-2 truncate">{thumbnail.title}</h3>
                                        <div className="flex justify-between text-sm text-stone-500">
                                            <span>{thumbnail.date}</span>
                                            <span>{thumbnail.dimensions}</span>
                                        </div>
                                    </div>
                                </ActivityCard>
                            ))}
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
                                <ActivityCard key={seo.id}>
                                    <div className="p-4">
                                        <h3 className="font-medium text-stone-800 mb-2 truncate">{seo.title}</h3>
                                        <div className="flex justify-between text-sm text-stone-500">
                                            <span>{seo.date}</span>
                                            <span>{seo.keywords} keywords</span>
                                        </div>
                                    </div>
                                    <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="h-2 w-16 bg-stone-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 rounded-full"
                                                    style={{ width: `${seo.score}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-stone-600 ml-2">{seo.score}%</span>
                                        </div>
                                        <button className="text-sm text-stone-600 hover:text-stone-800">Details</button>
                                    </div>
                                </ActivityCard>
                            ))}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activities.youtubePosts.slice(0, 3).map(post => (
                                <ActivityCard key={post.id}>
                                    <div className="p-4">
                                        <h3 className="font-medium text-stone-800 mb-2 truncate">{post.title}</h3>
                                        <div className="flex justify-between text-sm text-stone-500">
                                            <span>{post.date}</span>
                                            <span>{post.views.toLocaleString()} views</span>
                                        </div>
                                    </div>
                                    <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                        <span className="text-sm text-stone-600">{post.likes.toLocaleString()} likes</span>
                                        <a
                                            href={`https://${post.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-stone-600 hover:text-stone-800"
                                        >
                                            Visit
                                        </a>
                                    </div>
                                </ActivityCard>
                            ))}
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
                        return tabData.map(script => (
                            <ActivityCard key={script.id} className="flex flex-col h-full">
                                <div className="p-4 flex-grow">
                                    <h3 className="font-medium text-stone-800 mb-2">{script.title}</h3>
                                    <div className="flex justify-between text-sm text-stone-500">
                                        <span>{script.date}</span>
                                        <span>{script.wordCount} words</span>
                                    </div>
                                </div>
                                <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                    <span className="text-sm text-stone-600">{script.status}</span>
                                    <button className="text-sm text-stone-600 hover:text-stone-800">View</button>
                                </div>
                            </ActivityCard>
                        ));
                    case "voiceDubbings":
                        return tabData.map(dubbing => (
                            <ActivityCard key={dubbing.id} className="flex flex-col h-full">
                                <div className="p-4 flex-grow">
                                    <h3 className="font-medium text-stone-800 mb-2">{dubbing.title}</h3>
                                    <div className="flex justify-between text-sm text-stone-500">
                                        <span>{dubbing.date}</span>
                                        <span>{dubbing.duration}</span>
                                    </div>
                                </div>
                                <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                    <span className="text-sm text-stone-600">Voice: {dubbing.voice}</span>
                                    <button className="text-sm text-stone-600 hover:text-stone-800 flex items-center">
                                        <Clock className="h-4 w-4 mr-1" /> Play
                                    </button>
                                </div>
                            </ActivityCard>
                        ));
                    case "thumbnails":
                        return tabData.map(thumbnail => (
                            <ActivityCard key={thumbnail.id} className="flex flex-col h-full">
                                <div className="relative overflow-hidden" style={{ paddingTop: "56.25%" }}>
                                    <img
                                        src={thumbnail.previewUrl}
                                        alt={thumbnail.title}
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4 flex-grow">
                                    <h3 className="font-medium text-stone-800 mb-2">{thumbnail.title}</h3>
                                    <div className="flex justify-between text-sm text-stone-500">
                                        <span>{thumbnail.date}</span>
                                        <span>{thumbnail.dimensions}</span>
                                    </div>
                                </div>
                                <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                    <span className="text-sm text-stone-600">Thumbnail</span>
                                    <button className="text-sm text-stone-600 hover:text-stone-800">Download</button>
                                </div>
                            </ActivityCard>
                        ));
                    case "seoAnalyses":
                        return tabData.map(seo => (
                            <ActivityCard key={seo.id} className="flex flex-col h-full">
                                <div className="p-4 flex-grow">
                                    <h3 className="font-medium text-stone-800 mb-2">{seo.title}</h3>
                                    <div className="flex justify-between text-sm text-stone-500">
                                        <span>{seo.date}</span>
                                        <span>{seo.keywords} keywords</span>
                                    </div>
                                </div>
                                <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <div className="h-2 w-16 bg-stone-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 rounded-full"
                                                style={{ width: `${seo.score}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-stone-600 ml-2">{seo.score}%</span>
                                    </div>
                                    <button className="text-sm text-stone-600 hover:text-stone-800">Details</button>
                                </div>
                            </ActivityCard>
                        ));
                    case "youtubePosts":
                        return tabData.map(post => (
                            <ActivityCard key={post.id} className="flex flex-col h-full">
                                <div className="p-4 flex-grow">
                                    <h3 className="font-medium text-stone-800 mb-2">{post.title}</h3>
                                    <div className="flex justify-between text-sm text-stone-500">
                                        <span>{post.date}</span>
                                        <span>{post.views.toLocaleString()} views</span>
                                    </div>
                                </div>
                                <div className="bg-stone-50 px-4 py-2 border-t border-stone-100 flex justify-between items-center">
                                    <span className="text-sm text-stone-600">{post.likes.toLocaleString()} likes</span>
                                    <a
                                        href={`https://${post.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-stone-600 hover:text-stone-800 flex items-center"
                                    >
                                        <Youtube className="h-4 w-4 mr-1" /> Visit
                                    </a>
                                </div>
                            </ActivityCard>
                        ));
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
        </div>
    );
};

export default History;