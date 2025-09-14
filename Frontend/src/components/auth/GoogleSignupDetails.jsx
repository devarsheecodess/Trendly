import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GoogleSignupDetails = () => {
	const [formData, setFormData] = useState({
		email: "",
		contact: "",
		address: "",
		country: "",
		youtube: "",
		username: "",
		password: "",
		repeat_password: ""
	});
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		// Fetch current user from backend (cookie-based JWT)
		const fetchCurrentUser = async () => {
			try {
				const res = await axios.get(`${BACKEND_URL}/oauth/me`);
				const data = res.data;
				if (data.success && data.user && data.user.email) {
					setFormData(prev => ({ ...prev, email: data.user.email }));
					setUserId(data.user.userId || null);
				}
			} catch (err) {
				console.error('Failed to fetch current user:', err);
			}
		};
		fetchCurrentUser();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prevState => ({
			...prevState,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (formData.password !== formData.repeat_password) {
			alert("Passwords do not match!");
			return;
		}

		try {
			const response = await axios.put(`${BACKEND_URL}/oauth/userinfo`, {
				data: formData
			}, { withCredentials: true });

			if (response.data.success) {
				window.location.href = '/onboarding';
			} else {
				alert("Failed to update user info. Please try again.");
			}

		} catch (err) {
			console.error("Error updating user info:", err);
			alert("An error occurred. Please try again later.");
		}
	};


	return (
		<div className="flex justify-center items-center bg-stone-900 p-6 min-h-screen">
			<div className="w-full max-w-4xl">
				<div className="mb-8 text-center">
					<h1 className="font-bold text-stone-100 text-4xl">Trendly</h1>
					<p className="mt-2 text-stone-400">Complete your profile to continue</p>
				</div>

				<div className="bg-stone-800 shadow-xl p-8 border border-stone-700 rounded-xl">
					<form onSubmit={handleSubmit}>
						<div className="gap-6 grid grid-cols-1 md:grid-cols-2">
							<div>
								<label className="block mb-2 font-medium text-stone-300 text-sm" htmlFor="email">
									Email
								</label>
								<input
									id="email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleChange}
									className="bg-stone-700 px-4 py-3 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-stone-100"
									placeholder="Your email address"
									readOnly
								/>
							</div>

							<div>
								<label className="block mb-2 font-medium text-stone-300 text-sm" htmlFor="contact">
									Contact Number
								</label>
								<input
									id="contact"
									name="contact"
									type="tel"
									value={formData.contact}
									onChange={handleChange}
									className="bg-stone-700 px-4 py-3 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-stone-100"
									placeholder="Your contact number"
									required
								/>
							</div>

							<div>
								<label className="block mb-2 font-medium text-stone-300 text-sm" htmlFor="address">
									Address
								</label>
								<input
									id="address"
									name="address"
									type="text"
									value={formData.address}
									onChange={handleChange}
									className="bg-stone-700 px-4 py-3 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-stone-100"
									placeholder="Your address"
									required
								/>
							</div>

							<div>
								<label className="block mb-2 font-medium text-stone-300 text-sm" htmlFor="country">
									Country
								</label>
								<select
									id="country"
									name="country"
									value={formData.country}
									onChange={handleChange}
									className="bg-stone-700 px-4 py-3 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-stone-100 transition-all"
									required
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

							<div>
								<label className="block mb-2 font-medium text-stone-300 text-sm" htmlFor="youtube">
									YouTube Channel
								</label>
								<input
									id="youtube"
									name="youtube"
									type="text"
									value={formData.youtube}
									onChange={handleChange}
									className="bg-stone-700 px-4 py-3 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-stone-100"
									placeholder="Your YouTube channel name"
								/>
							</div>

							<div>
								<label className="block mb-2 font-medium text-stone-300 text-sm" htmlFor="username">
									Username
								</label>
								<input
									id="username"
									name="username"
									type="text"
									value={formData.username}
									onChange={handleChange}
									className="bg-stone-700 px-4 py-3 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-stone-100"
									placeholder="Choose a username"
									required
								/>
							</div>

							<div>
								<label className="block mb-2 font-medium text-stone-300 text-sm" htmlFor="password">
									Password
								</label>
								<input
									id="password"
									name="password"
									type="password"
									value={formData.password}
									onChange={handleChange}
									className="bg-stone-700 px-4 py-3 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-stone-100"
									placeholder="Choose a password"
									required
								/>
							</div>

							<div>
								<label className="block mb-2 font-medium text-stone-300 text-sm" htmlFor="repeat_password">
									Repeat Password
								</label>
								<input
									id="repeat_password"
									name="repeat_password"
									type="password"
									value={formData.repeat_password}
									onChange={handleChange}
									className="bg-stone-700 px-4 py-3 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-stone-100"
									placeholder="Repeat the password"
									required
								/>
							</div>
						</div>

						<div className="mt-8">
							<button
								type="submit"
								className="bg-stone-600 hover:bg-stone-500 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full font-medium text-stone-100 text-lg transition duration-200"
							>
								Complete Profile
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default GoogleSignupDetails;