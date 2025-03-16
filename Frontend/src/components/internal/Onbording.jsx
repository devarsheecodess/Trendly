import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Onboarding = () => {
    const [formStep, setFormStep] = useState(1);
    const totalSteps = 3;

    const [profileImage, setProfileImage] = useState(null);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    const [formData, setFormData] = useState({
        userId: localStorage.getItem('userId'),
        avatar: '',
        channelName: '',
        about: '',
        subscribers: '',
        contentType: '',
        contentNiche: [],
        ageGroups: [],
        audienceInterests: [],
        audienceDetails: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
                ? [...prev[name], value]  // Add value if checked
                : prev[name].filter(item => item !== value) // Remove if unchecked
        }));
    };

    const nextStep = () => setFormStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setFormStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("image", formData.avatar);

            const image = await axios.post(`${BACKEND_URL}/upload/store`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const updatedFormData = { ...formData, avatar: image.data.url };
            setFormData(updatedFormData);
            console.log(updatedFormData);

            await axios.post(`${BACKEND_URL}/auth/onboarding`, updatedFormData);
            alert("Welcome onboard!");
            window.location.href = '/dashboard';
        } catch (err) {
            console.log("Upload error:", err);
        }
    };


    const checkOnboardingStatus = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/auth/onboarding?userId=${localStorage.getItem('userId')}`);
            if (response.data.onboarding) {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData(prev => ({ ...prev, avatar: file }));

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            setProfileImage(event.target.result);
        };
    };

    useEffect(() => {
        checkOnboardingStatus();
    }, [])

    return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-stone-800 h-2" />

                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-stone-900 text-2xl font-bold">Complete Your Creator Profile</h1>
                        <div className="text-stone-500 text-sm">Step {formStep} of {totalSteps}</div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-stone-200 rounded-full mb-8">
                        <div
                            className="h-2 bg-stone-600 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${(formStep / totalSteps) * 100}%` }}
                        />
                    </div>

                    {formStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-medium text-stone-800">Basic Information</h2>

                            {/* Profile Picture Upload */}
                            <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                                <div className="w-32 h-32 relative">
                                    <div className={`w-32 h-32 rounded-full overflow-hidden bg-stone-200 flex items-center justify-center border-2 ${profileImage ? 'border-stone-400' : 'border-dashed border-stone-400'}`}>
                                        {profileImage ? (
                                            <img src={profileImage} alt="Profile preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        )}
                                    </div>

                                    <label htmlFor="profile-upload" className="absolute -bottom-1 -right-1 bg-stone-700 hover:bg-stone-800 rounded-full p-2 cursor-pointer shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <input
                                            id="profile-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            name='avatar'
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>

                                <div className="flex-1 w-full">
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Channel Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-stone-500 outline-none"
                                                placeholder="Your channel name"
                                                name='channelName'
                                                value={formData.channelName}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="about" className="block text-sm font-medium text-stone-700 mb-1">Tell Us About Yourself</label>
                                            <textarea
                                                id="about"
                                                name='about'
                                                value={formData.about}
                                                onChange={handleChange}
                                                rows={4}
                                                className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-stone-500 outline-none resize-none"
                                                placeholder="Share a brief description about yourself and your content..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {formStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-medium text-stone-800">Channel Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="subscribers" className="block text-sm font-medium text-stone-700 mb-1">Subscribers Count</label>
                                    <select
                                        id="subscribers"
                                        name='subscribers'
                                        value={formData.subscribers}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-stone-500 outline-none appearance-none bg-white"
                                    >
                                        <option value="">Select subscriber range</option>
                                        <option value="0-1000">0 - 1,000</option>
                                        <option value="1000-10000">1,000 - 10,000</option>
                                        <option value="10000-100000">10,000 - 100,000</option>
                                        <option value="100000-1000000">100,000 - 1,000,000</option>
                                        <option value="1000000+">1,000,000+</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="contentType" className="block text-sm font-medium text-stone-700 mb-1">Type of Creator</label>
                                    <select
                                        id="contentType"
                                        name='contentType'
                                        value={formData.contentType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-stone-500 outline-none appearance-none bg-white"
                                    >
                                        <option value="">Select content type</option>
                                        <option value="long-form">Long-form Videos</option>
                                        <option value="shorts">Shorts Creator</option>
                                        <option value="mixed">Both Long-form & Shorts</option>
                                        <option value="livestream">Primarily Livestreams</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-stone-700 mb-3">Content Niche</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {['Gaming', 'Education', 'Lifestyle', 'Beauty', 'Tech', 'Fitness', 'Food', 'Travel', 'Music', 'Comedy', 'Business', 'Arts & Crafts'].map((niche) => (
                                            <label key={niche} className="flex items-center p-3 border border-stone-200 rounded-md cursor-pointer hover:bg-stone-50">
                                                <input
                                                    name='contentNiche'
                                                    value={niche}
                                                    checked={formData.contentNiche.includes(niche)}
                                                    onChange={handleCheckboxChange}
                                                    type="checkbox"
                                                    className="h-4 w-4 text-stone-600 focus:ring-stone-500 border-stone-300 rounded"
                                                />
                                                <span className="ml-2 text-stone-700">{niche}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {formStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-medium text-stone-800">Target Audience</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Age Groups</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {['Under 18', '18-24', '25-34'].map((age) => (
                                            <label key={age} className="flex items-center p-3 border border-stone-200 rounded-md cursor-pointer hover:bg-stone-50">
                                                <input name='ageGroups' value={age} checked={formData.ageGroups.includes(age)} onChange={handleCheckboxChange} type="checkbox" className="h-4 w-4 text-stone-600 focus:ring-stone-500 border-stone-300 rounded" />
                                                <span className="ml-2 text-stone-700">{age}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Audience Interests</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Technology', 'Science', 'Arts'].map((interest) => (
                                            <label key={interest} className="inline-flex items-center px-3 py-1.5 border border-stone-200 rounded-full cursor-pointer hover:bg-stone-50">
                                                <input name='audienceInterests' value={interest} checked={formData.audienceInterests.includes(interest)} onChange={handleCheckboxChange} type="checkbox" className="h-3.5 w-3.5 text-stone-600 focus:ring-stone-500 border-stone-300 rounded" />
                                                <span className="ml-2 text-sm text-stone-700">{interest}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="audience-notes" className="block text-sm font-medium text-stone-700 mb-1">Additional Audience Details</label>
                                    <textarea
                                        id="audience-notes"
                                        name='audienceDetails'
                                        value={formData.audienceDetails}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-stone-500 outline-none resize-none"
                                        placeholder="Share any additional details about your target audience..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-stone-50 px-6 md:px-8 py-4 border-t border-stone-200">
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                        <button
                            onClick={prevStep}
                            className={`mt-3 sm:mt-0 px-5 py-2.5 rounded-md border border-stone-300 text-stone-700 font-medium hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500 ${formStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={formStep === 1}
                        >
                            Previous
                        </button>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => { }}
                                className="px-5 py-2.5 rounded-md border border-stone-300 text-stone-700 font-medium hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500"
                            >
                                Save as Draft
                            </button>

                            <button
                                onClick={formStep < totalSteps ? nextStep : handleSubmit}
                                className="px-5 py-2.5 rounded-md bg-stone-800 text-white font-medium hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-500"
                            >
                                {formStep < totalSteps ? 'Continue' : 'Complete Setup'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;