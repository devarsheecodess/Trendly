import React, { useState, useEffect } from 'react';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const Thumbnail = () => {
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);
    const [creator, setCreator] = useState(localStorage.getItem('creatorType') || "longform");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleGenerate = async () => {
        if (!topic) return;

        setIsGenerating(true);
        try {
            let aspectRatio;
            if (creator === "longform") {
                aspectRatio = "16:9";
            } else if (creator === "shortform") {
                aspectRatio = "9:16";
            }
            console.log(creator, aspectRatio);
            const prompt = `Write a prompt to generate the best possible thumbnail for youtube video strictly of aspect ratio ${aspectRatio} on topic ${topic}. The Thumbnail should be attractive, eye-catching, modern and error-free. The prompt should be such that it can be passed as a string to the AI model to generate the thumbnail. Don't use "" in the prompt. add some text if possible`;

            const response1 = await axios.post(`${BACKEND_URL}/prompt/generate`, { prompt: prompt });
            console.log(response1.data.response);

            const response2 = await axios.post(`${BACKEND_URL}/thumbnail/generate`, { prompt: response1.data.response });  // ✅ Fixed here

            setThumbnail({
                id: uuidv4(),
                url: response2.data.imageUrl,
                alt: `Thumbnail for ${topic}`
            });

            console.log(thumbnail.url)
            setIsGenerating(false);
        } catch (err) {
            console.error(err);
            setIsGenerating(false);
        }
    };
    const handleExport = async () => {
        if (!thumbnail) return;
        let link

        try {
            const response = await axios.get(`${BACKEND_URL}/thumbnail/download`, {
                params: { imageUrl: encodeURIComponent(thumbnail.url) },
                responseType: 'blob'
            });

            if (response.status !== 200) {
                throw new Error("Failed to download image");
            }

            const blob = new Blob([response.data], { type: 'image/png' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `thumbnail-${thumbnail.id}.jpg`;

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


    const handleSave = async () => {
        try {
            const formData = {
                userId: localStorage.getItem('userId'),
                thumbnail: thumbnail.url
            }
            const response = await axios.post(`${BACKEND_URL}/history/thumbnail`, formData);
            if (response.data.success) {
                alert("Thumbnail saved successfully!")
            }
        } catch (err) {
            console.error(err)
        }
    };

    return (
        <div className="w-full p-3 sm:p-4 md:p-6 bg-stone-50 min-h-screen md:pl-[300px] lg:pl-[300px]">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 mb-3 sm:mb-4 md:mb-6">Thumbnail</h1>

            {/* Input Section */}
            <div className="mb-4 sm:mb-6 bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-stone-200">
                <label htmlFor="topic" className="block text-sm font-medium text-stone-700 mb-2">
                    Video Topic
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter your video topic for thumbnail generation"
                        className="flex-grow px-3 py-2 sm:py-3 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white text-stone-900 w-full"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={!topic || isGenerating}
                        className={`mt-2 sm:mt-0 px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-center whitespace-nowrap ${!topic || isGenerating
                            ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                            : 'bg-stone-800 text-white hover:bg-stone-900'
                            } transition-colors sm:w-auto w-full`}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Thumbnail'}
                    </button>
                </div>
            </div>

            {/* Thumbnail Display Section */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                <div className="p-3 sm:p-4 md:p-6">
                    <h2 className="text-md sm:text-lg font-medium text-stone-900 mb-3 sm:mb-4">Generated Thumbnail</h2>

                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24">
                            {/* Sparkle Loader */}
                            <div className="relative w-16 h-16 mb-4">
                                <div className="absolute inset-0 animate-ping rounded-full bg-stone-200 opacity-75"></div>
                                <div className="relative flex justify-center items-center w-full h-full">
                                    <svg className="animate-spin h-8 w-8 text-stone-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                                <div className="absolute inset-0 animate-pulse rounded-full bg-stone-300 opacity-25"></div>
                                <div className="absolute top-0 left-0 w-3 h-3 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s', left: '20%', top: '-20%' }}></div>
                                <div className="absolute top-0 right-0 w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s', right: '20%', top: '-10%' }}></div>
                                <div className="absolute bottom-0 left-0 w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.7s', left: '15%', bottom: '-10%' }}></div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s', right: '15%', bottom: '-20%' }}></div>
                            </div>
                            <p className="text-stone-500 text-sm sm:text-base">Generating your thumbnail...</p>
                            <p className="text-stone-400 text-xs sm:text-sm mt-2">This might take a moment</p>
                        </div>
                    ) : thumbnail ? (
                        <div className="overflow-hidden">
                            <div className="rounded-lg overflow-hidden shadow-md border border-stone-200 max-w-2xl mx-auto">
                                <img
                                    src={thumbnail.url}
                                    alt={thumbnail.alt}
                                    className="w-full h-auto object-cover"
                                />
                                <div className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between">
                                    <span className="text-sm font-medium text-stone-800 mb-2 sm:mb-0">Generated Thumbnail</span>
                                    <div className="flex space-x-2">
                                        <button
                                            className="px-3 py-1.5 text-xs sm:text-sm rounded-md bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors flex items-center justify-center"
                                            onClick={handleSave}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                            </svg>
                                            Save
                                        </button>
                                        <button
                                            className="px-3 py-1.5 text-xs sm:text-sm rounded-md bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors flex items-center justify-center"
                                            onClick={handleExport}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-12 md:py-16">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 md:h-16 w-12 md:w-16 text-stone-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-stone-500">Enter a topic and click "Generate Thumbnail" to create an eye-catching thumbnail</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Thumbnail;