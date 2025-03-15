import React, { useState, useEffect } from 'react';

const Profile = () => {
    const [isMobile, setIsMobile] = useState(false);

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
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 123-456-7890',
        address: '123 Main Street',
        city: 'New York',
        country: 'United States',
        channelName: 'John\'s Creative Corner',
        contentNiche: 'DIY & Crafts',
        password: '',
        confirmPassword: '',
    });

    const [audienceAge, setAudienceAge] = useState({
        '13-17': false,
        '18-24': true,
        '25-34': true,
        '35-44': false,
        '45-54': false,
        '55+': false,
    });

    const [audienceInterests, setAudienceInterests] = useState({
        'Technology': true,
        'Fashion': false,
        'Gaming': true,
        'Food': false,
        'Travel': true,
        'Fitness': false,
        'Education': true,
        'Entertainment': false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAgeChange = (age) => {
        setAudienceAge({
            ...audienceAge,
            [age]: !audienceAge[age],
        });
    };

    const handleInterestChange = (interest) => {
        setAudienceInterests({
            ...audienceInterests,
            [interest]: !audienceInterests[interest],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Process form submission here
        console.log('Form data:', formData);
        console.log('Audience age:', audienceAge);
        console.log('Audience interests:', audienceInterests);
    };

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
                                    <label htmlFor="city" className="block text-sm font-medium text-stone-600 mb-1">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
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
                                        <option value="United States">United States</option>
                                        <option value="Canada">Canada</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Australia">Australia</option>
                                        <option value="Germany">Germany</option>
                                        <option value="France">France</option>
                                        <option value="Japan">Japan</option>
                                        <option value="India">India</option>
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
                                    <label htmlFor="contentNiche" className="block text-sm font-medium text-stone-600 mb-1">Content Niche</label>
                                    <select
                                        id="contentNiche"
                                        name="contentNiche"
                                        value={formData.contentNiche}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500"
                                    >
                                        <option value="DIY & Crafts">DIY & Crafts</option>
                                        <option value="Tech Reviews">Tech Reviews</option>
                                        <option value="Gaming">Gaming</option>
                                        <option value="Cooking">Cooking</option>
                                        <option value="Fitness">Fitness</option>
                                        <option value="Education">Education</option>
                                        <option value="Travel">Travel</option>
                                        <option value="Beauty & Fashion">Beauty & Fashion</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-2">Audience Age Groups</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.keys(audienceAge).map((age) => (
                                            <div key={age} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`age-${age}`}
                                                    checked={audienceAge[age]}
                                                    onChange={() => handleAgeChange(age)}
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
                                        {Object.keys(audienceInterests).map((interest) => (
                                            <div key={interest} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`interest-${interest}`}
                                                    checked={audienceInterests[interest]}
                                                    onChange={() => handleInterestChange(interest)}
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
                                <div className="w-28 h-28 bg-stone-200 rounded-full mb-4 flex items-center justify-center text-stone-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>

                                <button type="button" className="px-4 py-2 bg-stone-200 text-stone-700 rounded-md hover:bg-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-500">
                                    Change Photo
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end">
                        <button type="submit" className="px-6 py-2 bg-stone-700 text-white rounded-md hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;