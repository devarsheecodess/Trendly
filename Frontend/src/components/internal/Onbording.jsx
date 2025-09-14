import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Onboarding = () => {
	const [formStep, setFormStep] = useState(1);
	const totalSteps = 3;

	const [profileImage, setProfileImage] = useState(null);
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

	const [userId, setUserId] = useState(null);

	const [formData, setFormData] = useState({
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

			const response = await axios.post(`${BACKEND_URL}/auth/onboarding`, updatedFormData, { withCredentials: true });
			alert("Welcome onboard!");
			localStorage.setItem('username', response.data.username)
			localStorage.setItem('youtube', response.data.youtube)
			localStorage.setItem('avatar', response.data.avatar)
			window.location.href = '/dashboard';
		} catch (err) {
			console.log("Upload error:", err);
		}
	};


	const checkOnboardingStatus = async () => {
		try {
			const response = await axios.get(`${BACKEND_URL}/auth/onboarding`, { withCredentials: true });
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
		<div className="flex justify-center items-center bg-stone-100 p-4 min-h-screen">
			<div className="bg-white shadow-lg rounded-lg w-full max-w-4xl overflow-hidden">
				<div className="bg-stone-800 h-2" />

				<div className="p-6 md:p-8">
					<div className="flex justify-between items-center mb-6">
						<h1 className="font-bold text-stone-900 text-2xl">Complete Your Creator Profile</h1>
						<div className="text-stone-500 text-sm">Step {formStep} of {totalSteps}</div>
					</div>

					{/* Progress bar */}
					<div className="bg-stone-200 mb-8 rounded-full w-full h-2">
						<div
							className="bg-stone-600 rounded-full h-2 transition-all duration-300 ease-out"
							style={{ width: `${(formStep / totalSteps) * 100}%` }}
						/>
					</div>

					{formStep === 1 && (
						<div className="space-y-6">
							<h2 className="font-medium text-stone-800 text-xl">Basic Information</h2>

							{/* Profile Picture Upload */}
							<div className="flex md:flex-row flex-col items-center md:items-start gap-6">
								<div className="relative w-32 h-32">
									<div className={`w-32 h-32 rounded-full overflow-hidden bg-stone-200 flex items-center justify-center border-2 ${profileImage ? 'border-stone-400' : 'border-dashed border-stone-400'}`}>
										{profileImage ? (
											<img src={profileImage} alt="Profile preview" className="w-full h-full object-cover" />
										) : (
											<svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
											</svg>
										)}
									</div>

									<label htmlFor="profile-upload" className="-right-1 -bottom-1 absolute bg-stone-700 hover:bg-stone-800 shadow-md p-2 rounded-full cursor-pointer">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
											<label htmlFor="name" className="block mb-1 font-medium text-stone-700 text-sm">Channel Name</label>
											<input
												type="text"
												id="name"
												className="px-4 py-2 border border-stone-300 focus:border-stone-500 rounded-md outline-none focus:ring-2 focus:ring-stone-500 w-full"
												placeholder="Your channel name"
												name='channelName'
												value={formData.channelName}
												onChange={handleChange}
											/>
										</div>

										<div>
											<label htmlFor="about" className="block mb-1 font-medium text-stone-700 text-sm">Tell Us About Yourself</label>
											<textarea
												id="about"
												name='about'
												value={formData.about}
												onChange={handleChange}
												rows={4}
												className="px-4 py-2 border border-stone-300 focus:border-stone-500 rounded-md outline-none focus:ring-2 focus:ring-stone-500 w-full resize-none"
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
							<h2 className="font-medium text-stone-800 text-xl">Channel Details</h2>

							<div className="gap-6 grid grid-cols-1 md:grid-cols-2">
								<div>
									<label htmlFor="subscribers" className="block mb-1 font-medium text-stone-700 text-sm">Subscribers Count</label>
									<select
										id="subscribers"
										name='subscribers'
										value={formData.subscribers}
										onChange={handleChange}
										className="bg-white px-4 py-2 border border-stone-300 focus:border-stone-500 rounded-md outline-none focus:ring-2 focus:ring-stone-500 w-full appearance-none"
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
									<label htmlFor="contentType" className="block mb-1 font-medium text-stone-700 text-sm">Type of Creator</label>
									<select
										id="contentType"
										name='contentType'
										value={formData.contentType}
										onChange={handleChange}
										className="bg-white px-4 py-2 border border-stone-300 focus:border-stone-500 rounded-md outline-none focus:ring-2 focus:ring-stone-500 w-full appearance-none"
									>
										<option value="">Select content type</option>
										<option value="long-form">Long-form Videos</option>
										<option value="shorts">Shorts Creator</option>
										<option value="mixed">Both Long-form & Shorts</option>
										<option value="livestream">Primarily Livestreams</option>
									</select>
								</div>

								<div className="md:col-span-2">
									<label className="block mb-3 font-medium text-stone-700 text-sm">Content Niche</label>
									<div className="gap-3 grid grid-cols-2 md:grid-cols-3">
										{['Gaming', 'Education', 'Lifestyle', 'Beauty', 'Tech', 'Fitness', 'Food', 'Travel', 'Music', 'Comedy', 'Business', 'Arts & Crafts'].map((niche) => (
											<label key={niche} className="flex items-center hover:bg-stone-50 p-3 border border-stone-200 rounded-md cursor-pointer">
												<input
													name='contentNiche'
													value={niche}
													checked={formData.contentNiche.includes(niche)}
													onChange={handleCheckboxChange}
													type="checkbox"
													className="border-stone-300 rounded focus:ring-stone-500 w-4 h-4 text-stone-600"
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
							<h2 className="font-medium text-stone-800 text-xl">Target Audience</h2>

							<div className="space-y-6">
								<div>
									<label className="block mb-1 font-medium text-stone-700 text-sm">Age Groups</label>
									<div className="gap-3 grid grid-cols-2 md:grid-cols-4">
										{['Under 18', '18-24', '25-34'].map((age) => (
											<label key={age} className="flex items-center hover:bg-stone-50 p-3 border border-stone-200 rounded-md cursor-pointer">
												<input name='ageGroups' value={age} checked={formData.ageGroups.includes(age)} onChange={handleCheckboxChange} type="checkbox" className="border-stone-300 rounded focus:ring-stone-500 w-4 h-4 text-stone-600" />
												<span className="ml-2 text-stone-700">{age}</span>
											</label>
										))}
									</div>
								</div>

								<div>
									<label className="block mb-1 font-medium text-stone-700 text-sm">Audience Interests</label>
									<div className="flex flex-wrap gap-2">
										{['Technology', 'Science', 'Arts'].map((interest) => (
											<label key={interest} className="inline-flex items-center hover:bg-stone-50 px-3 py-1.5 border border-stone-200 rounded-full cursor-pointer">
												<input name='audienceInterests' value={interest} checked={formData.audienceInterests.includes(interest)} onChange={handleCheckboxChange} type="checkbox" className="border-stone-300 rounded focus:ring-stone-500 w-3.5 h-3.5 text-stone-600" />
												<span className="ml-2 text-stone-700 text-sm">{interest}</span>
											</label>
										))}
									</div>
								</div>

								<div>
									<label htmlFor="audience-notes" className="block mb-1 font-medium text-stone-700 text-sm">Additional Audience Details</label>
									<textarea
										id="audience-notes"
										name='audienceDetails'
										value={formData.audienceDetails}
										onChange={handleChange}
										rows={3}
										className="px-4 py-2 border border-stone-300 focus:border-stone-500 rounded-md outline-none focus:ring-2 focus:ring-stone-500 w-full resize-none"
										placeholder="Share any additional details about your target audience..."
									/>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="bg-stone-50 px-6 md:px-8 py-4 border-stone-200 border-t">
					<div className="flex sm:flex-row flex-col-reverse sm:justify-between sm:space-x-2">
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
								className="hover:bg-stone-100 px-5 py-2.5 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 font-medium text-stone-700"
							>
								Save as Draft
							</button>

							<button
								onClick={formStep < totalSteps ? nextStep : handleSubmit}
								className="bg-stone-800 hover:bg-stone-900 px-5 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-500 font-medium text-white"
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