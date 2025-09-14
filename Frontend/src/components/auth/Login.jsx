import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';

const LoginForm = () => {
	const [formData, setFormData] = useState({
		username: '',
		password: ''
	});
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value
		});
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
		try {
			const response = await axios.post(`${BACKEND_URL}/auth/login`, formData);
			if (response.data.success) {
				alert("Login successful");
				await fetchAvatar();
				localStorage.setItem('username', response.data.name);
				localStorage.setItem('youtube', response.data.youtube);
				window.location.href = '/dashboard';
			} else {
				alert(response.data.message);
			}

			if (response.status === 404) {
				alert("User not found");
			}
		} catch (error) {
			console.error(error);
		}
	}

	const handleGoogleLogin = async () => {
		// Open backend OAuth endpoint. Backend will set a secure httpOnly cookie on callback.
		window.open(`${BACKEND_URL}/oauth/user/login/google`, "_self");
	};

	return (
		<form className="space-y-4">
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
					placeholder="Enter your username"
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

			<div className="flex justify-between items-center">
				<div className="flex items-center">
					<input
						id="remember"
						type="checkbox"
						className="bg-stone-800 border-stone-600 rounded focus:ring-stone-500 w-4 h-4"
					/>
					<label htmlFor="remember" className="ml-2 text-stone-400 text-sm">
						Remember me
					</label>
				</div>
				<a href="#" className="text-stone-400 hover:text-white text-sm transition-colors">
					Forgot password?
				</a>
			</div>

			<button
				onClick={handleSubmit}
				className="bg-stone-600 hover:bg-stone-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-stone-900 w-full font-medium text-white transition-colors"
			>
				Login
			</button>

			<div className="relative my-4">
				<div className="absolute inset-0 flex items-center">
					<div className="border-stone-700 border-t w-full"></div>
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="bg-stone-900 px-4 text-stone-400">or continue with</span>
				</div>
			</div>

			<button
				type="button"
				onClick={handleGoogleLogin}
				className="flex justify-center items-center bg-stone-800 hover:bg-stone-700 px-4 py-3 border border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 w-full font-medium text-white transition-colors"
			>
				<FcGoogle className="mr-2 w-5 h-5" />
				Sign in with Google
			</button>
		</form>
	);
};

export default LoginForm;