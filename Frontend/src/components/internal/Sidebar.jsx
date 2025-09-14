import { LogOut } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import SidebarPic from '../../assets/sidebar.png'

const Sidebar = () => {
	const [isMobile, setIsMobile] = useState(false);
	const [isOpen, setIsOpen] = useState(true);
	// no longer use localStorage 'google' flag; backend issues JWT cookie
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
	const [username, setUsername] = useState(localStorage.getItem('username') || '');
	const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || SidebarPic);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const me = await axios.get(`${BACKEND_URL}/oauth/me`, { withCredentials: true });
				if (me.data && me.data.success && me.data.user) {
					const name = me.data.user.name || '';
					setUsername(name);
					if (name) localStorage.setItem('username', name);
				}
			} catch (err) {
				// ignore - not logged in
			}

			try {
				const av = await axios.get(`${BACKEND_URL}/auth/avatar`, { withCredentials: true });
				if (av.data && av.data.success && av.data.avatar) {
					setAvatar(av.data.avatar);
					localStorage.setItem('avatar', av.data.avatar);
				}
			} catch (err) {
				// ignore
			}
		};

		fetchUser();
	}, []);

	// Check if screen is mobile size
	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 768);
			if (window.innerWidth < 768) {
				setIsOpen(false);
			} else {
				setIsOpen(true);
			}
		};

		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);

		return () => {
			window.removeEventListener('resize', checkScreenSize);
		};
	}, []);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	const handleLogout = async () => {
		const cf = confirm('Are you sure you want to logout?');
		if (!cf) return;
		localStorage.clear()
		// Try to logout from backend if cookie-based session exists
		try {
			const me = await axios.get(`${BACKEND_URL}/oauth/me`, { withCredentials: true });
			if (me.data && me.data.success) {
				await axios.get(`${BACKEND_URL}/oauth/user/logout`, { withCredentials: true });
			}
		} catch (err) {
			// ignore
		}
		window.location.href = '/'
	}

	const menuItems = [
		{ id: 0, name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: '/dashboard' },
		{ id: 1, name: 'Script Writing', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', path: '/script' },
		{ id: 2, name: 'Voice Over', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z', path: '/voiceover' },
		{ id: 3, name: 'Thumbnail', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', path: '/thumbnail' },
		{ id: 4, name: 'SEO Analyzer', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', path: '/seo' },
		{ id: 5, name: 'Post', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8', path: '/post' },
		{ id: 6, name: 'History', icon: 'M12 8v4l3 3m6-3A9 9 0 1 1 12 3a9 9 0 0 1 9 9z', path: '/history' }
	];

	return (
		<>
			{/* Mobile Toggle Button */}
			{isMobile && (
				<button
					onClick={toggleSidebar}
					className="top-4 right-4 z-50 fixed bg-stone-800 shadow-lg p-2 rounded-md text-white"
					aria-label="Toggle menu"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
					</svg>
				</button>
			)}

			{/* Sidebar */}
			<div
				className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${isMobile ? 'w-64' : 'w-64'}`}
			>
				<div className='flex justify-between items-center px-4 py-3 border-stone-200 border-b'>
					{/* Logo Area */}
					<img src={SidebarPic} alt="Sidebar" className="mt-3 w-full h-15 object-contain" />
				</div>

				{/* Navigation */}
				<nav className="flex-1 px-2 py-4 overflow-y-auto">
					{menuItems.map((item, index) => (
						<NavLink
							key={index}
							to={item.path}
							className={({ isActive }) =>
								`mb-1 flex items-center px-4 py-3 text-stone-700 hover:bg-stone-100 rounded-md transition-colors duration-200 relative ${isActive ? 'bg-stone-100' : ''}`
							}
						>
							{({ isActive }) => (
								<>
									<svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isActive ? 'text-stone-800' : 'text-stone-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
									</svg>
									<span className={`ml-3 ${isActive ? 'font-medium' : ''}`}>
										{item.name}
									</span>
									{isActive && (
										<div className="left-0 absolute bg-stone-800 rounded-r-full w-1 h-8"></div>
									)}
								</>
							)}
						</NavLink>
					))}

					{/* Logout Button - Made consistent with other menu items */}
					<button
						onClick={handleLogout}
						className="relative flex items-center hover:bg-stone-100 mb-1 px-4 py-3 rounded-md w-full text-red-800 transition-colors duration-200"
					>
						<LogOut className="w-5 h-5" />
						<span className="ml-3">Logout</span>
					</button>
				</nav>

				{/* User Profile */}
				<div className="p-4 border-stone-200 border-t">
					<a href="profile" className="flex items-center space-x-3">
						<img src={avatar} className="flex justify-center items-center bg-stone-300 rounded-full w-8 h-8 overflow-hidden">
						</img>
						<div>
							<div className="font-medium text-stone-700 text-sm">{username}</div>
							<div className="text-stone-500 text-xs">Creator</div>
						</div>
					</a>
				</div>
			</div>

			{/* Overlay when mobile sidebar is open */}
			{isMobile && isOpen && (
				<div
					className="z-30 fixed inset-0 bg-black bg-opacity-50"
					onClick={toggleSidebar}
				></div>
			)}
		</>
	);
};

export default Sidebar;