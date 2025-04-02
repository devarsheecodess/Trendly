import React, { useState } from 'react';
import axios from "axios"

const Post = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        videoFile: null,
        videoUrl: "",
        thumbnailFile: null,
        thumbnailUrl: "",
        isLive: false,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        const updatedValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;

        setFormData(prev => ({
            ...prev,
            [name]: updatedValue
        }));

        if (type === 'file') {
            if (name === 'videoFile') {
                handleUploadVideo(files[0]);
            } else if (name === 'thumbnailFile') {
                handleUploadThumbnail(files[0]);
            }
        }
    };

    const handleUploadVideo = async (file) => {
        if (!file) return;
        try {
            const videoData = new FormData();
            videoData.append("video", file);

            const response = await axios.post("http://localhost:3000/upload-video/upload", videoData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setFormData(prev => ({ ...prev, videoUrl: response.data.videoUrl }));
        } catch (err) {
            console.error("Error uploading video:", err);
        }
    };

    const handleUploadThumbnail = async (file) => {
        if (!file) return;
        try {
            const thumbnailData = new FormData();
            thumbnailData.append("image", file);

            const response = await axios.post("http://localhost:3000/upload/store", thumbnailData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log(response.data); // Debugging line


            setFormData(prev => ({ ...prev, thumbnailUrl: response.data.url }));
        } catch (err) {
            console.error("Error uploading thumbnail:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let descriptionWithTags = formData.description; // Default to description only

            if (formData.tags.trim().length > 0) {
                const tags = formData.tags
                    .split(",")
                    .map(tag => tag.trim()) // Remove spaces around each tag
                    .filter(tag => tag !== "") // Remove empty tags
                    .map(tag => `#${tag}`) // Add '#' to each tag
                    .join(" "); // Join with spaces

                descriptionWithTags = `${formData.description}\n\n${tags}`.replace(/\n/g, "<br>");
            }

            const formDataToSend = {
                videoPath: formData.videoUrl,
                title: formData.title,
                description: descriptionWithTags, // Ensure this is always defined
                categoryId: formData.category,
                privacyStatus: formData.visibility,
                publishTime: formData.schedulePost
                    ? `${formData.scheduleDate}T${formData.scheduleTime}:00Z`
                    : null, // Use null instead of empty string
                thumbnailPath: formData.thumbnailUrl,
            };

            const response = await axios.post("http://localhost:3000/youtube/upload", formDataToSend);

            if (response.data.success) {
                alert("Video posted successfully!");
                console.log("Video URL:", response.data.videoUrl);
            } else {
                console.error("Server Error:", response.data);
            }
        } catch (err) {
            console.error("Error submitting post:", err.response?.data || err.message);
        }
    };

    return (
        <div className="md:ml-64 p-4 md:p-6 bg-stone-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-stone-800 mb-6">Post Content</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Video Upload Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
                        <h2 className="text-xl font-semibold text-stone-700 mb-4">Video Upload</h2>

                        <div className="mb-6">
                            <label htmlFor="videoFile" className="block text-sm font-medium text-stone-600 mb-1">
                                Video File
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-stone-300 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-10 h-10 mb-3 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <p className="mb-2 text-sm text-stone-600">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-stone-500">MP4, MOV, AVI (MAX. 10GB)</p>
                                        {formData.videoFile && (
                                            <p className="mt-2 text-sm text-stone-600 font-medium">
                                                Selected: {formData.videoFile.name}
                                            </p>
                                        )}
                                    </div>
                                    <input
                                        id="videoFile"
                                        name="videoFile"
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="thumbnailFile" className="block text-sm font-medium text-stone-600 mb-1">
                                Custom Thumbnail (Optional)
                            </label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-stone-300 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-2 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <p className="text-xs text-stone-500">JPG, PNG (1280×720 recommended)</p>
                                        {formData.thumbnailFile && (
                                            <p className="mt-2 text-xs text-stone-600 font-medium">
                                                Selected: {formData.thumbnailFile.name}
                                            </p>
                                        )}
                                    </div>
                                    <input
                                        id="thumbnailFile"
                                        name="thumbnailFile"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Video Details Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
                        <h2 className="text-xl font-semibold text-stone-700 mb-4">Video Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-stone-600 mb-1">
                                    Title <span className="text-stone-500">(100 characters max)</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    maxLength="100"
                                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-stone-600 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="6"
                                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-stone-600 mb-1">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select a category</option>
                                        <option value="1">Film & Animation</option>
                                        <option value="2">Autos & Vehicles</option>
                                        <option value="10">Music</option>
                                        <option value="15">Pets & Animals</option>
                                        <option value="17">Sports</option>
                                        <option value="18">Short Movies</option>
                                        <option value="19">Travel & Events</option>
                                        <option value="20">Gaming</option>
                                        <option value="21">Videoblogging</option>
                                        <option value="22">People & Blogs</option>
                                        <option value="23">Comedy</option>
                                        <option value="24">Entertainment</option>
                                        <option value="25">News & Politics</option>
                                        <option value="26">How-to & Style</option>
                                        <option value="27">Education</option>
                                        <option value="28">Science & Technology</option>
                                        <option value="30">Movies</option>
                                        <option value="31">Anime/Animation</option>
                                        <option value="32">Action/Adventure</option>
                                        <option value="33">Classics</option>
                                        <option value="34">Comedy (Film)</option>
                                        <option value="35">Documentary</option>
                                        <option value="36">Drama</option>
                                        <option value="37">Family</option>
                                        <option value="38">Foreign</option>
                                        <option value="39">Horror</option>
                                        <option value="40">Sci-Fi/Fantasy</option>
                                        <option value="41">Thriller</option>
                                        <option value="42">Shorts</option>
                                        <option value="43">Shows</option>
                                        <option value="44">Trailers</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="visibility" className="block text-sm font-medium text-stone-600 mb-1">
                                        Visibility
                                    </label>
                                    <select
                                        id="visibility"
                                        name="visibility"
                                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                        value={formData.visibility}
                                        onChange={handleInputChange}
                                    >
                                        <option value="public">Public</option>
                                        <option value="unlisted">Unlisted</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-stone-600 mb-1">
                                    Tags <span className="text-stone-500">(separated by commas)</span>
                                </label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                    placeholder="gaming, tutorial, vlog"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Scheduling Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-stone-700">Schedule</h2>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="schedulePost"
                                    className="sr-only peer"
                                    checked={formData.schedulePost}
                                    onChange={handleInputChange}
                                />
                                <div className="relative w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-stone-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-600"></div>
                                <span className="ms-3 text-sm font-medium text-stone-600">
                                    {formData.schedulePost ? 'Scheduled' : 'Post now'}
                                </span>
                            </label>
                        </div>

                        {formData.schedulePost && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label htmlFor="scheduleDate" className="block text-sm font-medium text-stone-600 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        id="scheduleDate"
                                        name="scheduleDate"
                                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                        value={formData.scheduleDate}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="scheduleTime" className="block text-sm font-medium text-stone-600 mb-1">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        id="scheduleTime"
                                        name="scheduleTime"
                                        className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                        value={formData.scheduleTime}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-6 py-2 border border-stone-300 text-stone-700 rounded-md hover:bg-stone-100 transition-colors"
                        >
                            Save Draft
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-stone-800 text-white rounded-md hover:bg-stone-900 transition-colors"
                        >
                            {formData.schedulePost ? 'Schedule Post' : 'Post Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Post;