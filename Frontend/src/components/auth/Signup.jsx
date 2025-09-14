import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';

const SignupForm = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		contact: '',
		address: '',
		country: '',
		youtube: '',
		username: '',
		password: '',
	})
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	const [confirmPassword, setConfirmPassword] = useState('');
	const [agreeTerms, setAgreeTerms] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value
		})
	}

	const fetchAvatar = async (id) => {
		try {
			const response = await axios.get(`${BACKEND_URL}/auth/avatar`, { withCredentials: true });
			if (response.data.success) {
				localStorage.setItem('avatar', response.data.avatar);
			} else {
				localStorage.setItem('avatar', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLMI5YxZE03Vnj-s-sth2_JxlPd30Zy7yEGg&s');
			}
		} catch (err) {
			console.error(err);
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Basic validation
		if (formData.password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		if (!agreeTerms) {
			alert("Please agree to the terms and conditions");
			return;
		}

		console.log(formData)

		try {
			const response = await axios.post(`${BACKEND_URL}/auth/signup`, formData);
			if (response.data.success) {
				await fetchAvatar(response.data.userId);
				localStorage.setItem('email', formData.email);
				localStorage.setItem('username', formData.name);
				localStorage.setItem('youtube', formData.youtube);
				window.location.href = '/verify';
			}
		} catch (error) {
			console.error("Error signing up:", error);
		}
	};

	return (
		<form className="space-y-4">
			<div>
				<label htmlFor="name" className="block mb-1 font-medium text-stone-300 text-sm">
					Full Name
				</label>
				<input
					type="text"
					id="name"
					onChange={handleChange}
					value={formData.name}
					className="bg-stone-800 px-4 py-2 border border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-white transition-all"
					placeholder="John Doe"
				/>
			</div>

			<div>
				<label htmlFor="email" className="block mb-1 font-medium text-stone-300 text-sm">
					Email
				</label>
				<input
					type="email"
					id="email"
					onChange={handleChange}
					value={formData.email}
					className="bg-stone-800 px-4 py-2 border border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-white transition-all"
					placeholder="johndoe@example.com"
				/>
			</div>

			<div>
				<label htmlFor="contact" className="block mb-1 font-medium text-stone-300 text-sm">
					Contact Number
				</label>
				<input
					type="tel"
					id="contact"
					onChange={handleChange}
					value={formData.contact}
					className="bg-stone-800 px-4 py-2 border border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-white transition-all"
					placeholder="+1 (555) 123-4567"
				/>
			</div>

			<div>
				<label htmlFor="address" className="block mb-1 font-medium text-stone-300 text-sm">
					Address
				</label>
				<input
					type="text"
					id="address"
					onChange={handleChange}
					value={formData.address}
					className="bg-stone-800 px-4 py-2 border border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-white transition-all"
					placeholder="123 Main St, Apt 4B"
				/>
			</div>

			<div>
				<label htmlFor="country" className="block mb-1 font-medium text-stone-300 text-sm">
					Country
				</label>
				<select
					id="country"
					onChange={handleChange}
					value={formData.country}
					className="bg-stone-800 px-4 py-2 border border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-white transition-all"
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
				<label htmlFor="youtube" className="block mb-1 font-medium text-stone-300 text-sm">
					YouTube Channel Name
				</label>
				<input
					type="text"
					id="youtube"
					onChange={handleChange}
					value={formData.youtube}
					className="bg-stone-800 px-4 py-2 border border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-white transition-all"
					placeholder="My Awesome Channel"
				/>
			</div>

			<div>
				<label htmlFor="username" className="block mb-1 font-medium text-stone-300 text-sm">
					Username
				</label>
				<input
					type="text"
					id="username"
					onChange={handleChange}
					value={formData.username}
					className="bg-stone-800 px-4 py-2 border border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-white transition-all"
					placeholder="johndoe123"
				/>
			</div>

			<div>
				<label htmlFor="password" className="block mb-1 font-medium text-stone-300 text-sm">
					Password
				</label>
				<input
					type="password"
					id="password"
					onChange={handleChange}
					value={formData.password}
					className="bg-stone-800 px-4 py-2 border border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-white transition-all"
					placeholder="••••••••"
				/>
			</div>

			<div>
				<label htmlFor="confirmPassword" className="block mb-1 font-medium text-stone-300 text-sm">
					Confirm Password
				</label>
				<input
					type="password"
					id="confirmPassword"
					onChange={(e) => setConfirmPassword(e.target.value)}
					value={confirmPassword}
					className="bg-stone-800 px-4 py-2 border border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full text-white transition-all"
					placeholder="••••••••"
				/>
			</div>

			<div className="flex items-center">
				<input
					id="terms"
					type="checkbox"
					className="bg-stone-800 border-stone-600 rounded focus:ring-stone-500 w-4 h-4"
					onChange={(e) => setAgreeTerms(e.target.checked)}
					checked={agreeTerms}
				/>
				<label htmlFor="terms" className="ml-2 text-stone-400 text-sm">
					I agree to the <a href="#" className="text-stone-300 hover:text-white">Terms and Conditions</a>
				</label>
			</div>

			<button
				onClick={handleSubmit}
				className="bg-stone-600 hover:bg-stone-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-stone-900 w-full font-medium text-white transition-colors"
			>
				Create Account
			</button>
		</form>
	);
};

export default SignupForm;