import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Profile = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const fileInputRef = useRef(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Add this function to handle image load events
    const handleImageLoad = () => {
        setImageLoading(false);
    };

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        avatar: '',
        email: '',
        phone: '',
        address: '',
        country: '',
        channelName: '',
        contentNiche: [],
        ageGroups: [],
        audienceInterests: [],
        password: '',
        confirmPassword: '',
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleArrayChange = (field, value) => {
        setFormData(prevData => {
            // Check if the value already exists in the array
            if (prevData[field].includes(value)) {
                // Remove it if it exists
                return {
                    ...prevData,
                    [field]: prevData[field].filter(item => item !== value)
                };
            } else {
                // Add it if it doesn't exist
                return {
                    ...prevData,
                    [field]: [...prevData[field], value]
                };
            }
        });
    };

    const handlePhotoButtonClick = () => {
        // Trigger the hidden file input click
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            // Create a preview URL
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const updateData = {
                userId, // Include userId in the body instead of the query string
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                country: formData.country,
                channelName: formData.channelName,
                contentNiche: formData.contentNiche,
                ageGroups: Array.isArray(formData.ageGroups) ? formData.ageGroups : [],
                audienceInterests: Array.isArray(formData.audienceInterests) ? formData.audienceInterests : [],
            };

            // Include password only if provided and matching
            if (formData.password) {
                if (formData.password !== formData.confirmPassword) {
                    alert("Passwords do not match");
                    return;
                }
                updateData.password = formData.password;
            }

            // Handle avatar upload if there's a new file
            if (avatarFile) {
                const imageFormData = new FormData();
                imageFormData.append('image', avatarFile);

                const uploadResponse = await axios.post(`${BACKEND_URL}/upload/store`, imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Set the new avatar URL in update data
                updateData.avatar = uploadResponse.data.url;
                localStorage.setItem('avatar', uploadResponse.data.url);

                // Delete the old avatar from Cloudinary if it exists
                if (formData.avatar) {
                    try {
                        await axios.delete(`${BACKEND_URL}/cloudinary/delete`, {
                            data: { cloudinaryUrl: formData.avatar }
                        });
                    } catch (deleteErr) {
                        console.error("Error deleting old avatar:", deleteErr);
                        // Continue with update even if delete fails
                    }
                }
            } else {
                // Keep the existing avatar
                updateData.avatar = formData.avatar;
            }

            const response = await axios.put(`${BACKEND_URL}/user/update`, updateData);

            if (response.status === 200) {
                setIsSaving(false);
                alert("Profile updated successfully");
                // Clean up preview URL
                if (avatarPreview) {
                    URL.revokeObjectURL(avatarPreview);
                    setAvatarPreview('');
                }
                setAvatarFile(null);

                // Refresh profile data
                fetchProfileData();
            } else {
                alert("Failed to update profile");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("An error occurred while updating your profile. Please try again.");
        }
    };

    // Age group options
    const ageOptions = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'];

    // Interest options
    const interestOptions = ['Gaming', 'Technology', 'Fashion', 'Sports', 'Cooking', 'Travel', 'Music', 'Art'];

    // Content niche options
    const nicheOptions = ['DIY & Crafts', 'Tech', 'Gaming', 'Cooking', 'Fitness', 'Education', 'Travel', 'Beauty & Fashion'];

    const fetchProfileData = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/user/profile?userId=${localStorage.getItem('userId')}`);
            setFormData(response.data);
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        console.log(BACKEND_URL);
        fetchProfileData();
    }, []);

    return (
        <div className={`${isMobile ? 'p-4' : 'ml-64 p-6'} bg-stone-50 min-h-screen`}>
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-semibold text-stone-800 mb-6">Your Profile</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-stone-200">
                            <h2 className="text-xl font-medium text-stone-700 mb-4">Personal Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-stone-600 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-stone-600 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-stone-600 mb-1">Contact Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-stone-600 mb-1">Address</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-stone-600 mb-1">Country</label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
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
                            </div>
                        </div>

                        {/* Channel Information */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-stone-200">
                            <h2 className="text-xl font-medium text-stone-700 mb-4">Channel Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="channelName" className="block text-sm font-medium text-stone-600 mb-1">Channel Name</label>
                                    <input
                                        type="text"
                                        id="channelName"
                                        name="channelName"
                                        value={formData.channelName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-2">Content Niche</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {nicheOptions.map((niche) => (
                                            <div key={niche} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`niche-${niche}`}
                                                    checked={formData.contentNiche.includes(niche)}
                                                    onChange={() => handleArrayChange('contentNiche', niche)}
                                                    className="w-4 h-4 text-stone-600 border-stone-300 rounded focus:ring-stone-500"
                                                />
                                                <label htmlFor={`niche-${niche}`} className="ml-2 text-sm text-stone-700">{niche}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-2">Age Groups</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {ageOptions.map((age) => (
                                            <div key={age} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`age-${age}`}
                                                    checked={formData.ageGroups.includes(age)}
                                                    onChange={() => handleArrayChange('ageGroups', age)}
                                                    className="w-4 h-4 text-stone-600 border-stone-300 rounded focus:ring-stone-500"
                                                />
                                                <label htmlFor={`age-${age}`} className="ml-2 text-sm text-stone-700">{age}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-2">Audience Interests</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {interestOptions.map((interest) => (
                                            <div key={interest} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`interest-${interest}`}
                                                    checked={formData.audienceInterests.includes(interest)}
                                                    onChange={() => handleArrayChange('audienceInterests', interest)}
                                                    className="w-4 h-4 text-stone-600 border-stone-300 rounded focus:ring-stone-500"
                                                />
                                                <label htmlFor={`interest-${interest}`} className="ml-2 text-sm text-stone-700">{interest}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-stone-200">
                            <h2 className="text-xl font-medium text-stone-700 mb-4">Security</h2>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-stone-600 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-600 mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Profile Picture */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-stone-200">
                            <h2 className="text-xl font-medium text-stone-700 mb-4">Profile Picture</h2>

                            <div className="flex flex-col items-center">
                                <div className="w-28 h-28 rounded-full mb-4 overflow-hidden relative">
                                    {avatarPreview ? (
                                        <>
                                            {imageLoading && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
                                                    <svg className="animate-spin h-6 w-6 text-stone-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </div>
                                            )}
                                            <img
                                                src={avatarPreview}
                                                alt="Profile Preview"
                                                className="w-full h-full object-cover"
                                                onLoad={handleImageLoad}
                                                onError={() => setImageLoading(false)}
                                            />
                                        </>
                                    ) : formData.avatar ? (
                                        <>
                                            {imageLoading && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
                                                    <svg className="animate-spin h-6 w-6 text-stone-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </div>
                                            )}
                                            <img
                                                src={formData.avatar}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                                onLoad={handleImageLoad}
                                                onError={() => setImageLoading(false)}
                                            />
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />

                                <button
                                    type="button"
                                    onClick={handlePhotoButtonClick}
                                    className="px-4 py-2 bg-stone-200 text-stone-700 rounded-md hover:bg-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-500"
                                >
                                    Change Photo
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 bg-stone-700 text-white rounded-md hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 flex items-center space-x-2"
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;