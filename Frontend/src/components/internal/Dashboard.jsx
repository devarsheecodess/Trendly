import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
	const [id, setId] = useState(null);
	const [youtube, setYoutube] = useState('');
	const [isMobile, setIsMobile] = useState(false);
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	const [avatar, setAvatar] = useState('');
	const [contentData, setContentData] = useState({
		recentProjects: [],
		voiceoverStats: { completed: 0 },
		thumbnailStats: { generated: 0 },
		scriptStats: { completed: 0 },
		SEOStats: { completed: 0 },
		videoStats: { posted: 0 }
	});

	// Trending topics data
	const [trendingTopics, setTrendingTopics] = useState([]);
	const [loading, setLoading] = useState(false); // Loader state

	function getCookieValue(cookieName) {
		const cookies = document.cookie.split("; ");
		const cookie = cookies.find(row => row.startsWith(`${cookieName}=`));
		return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
	}

	const fetchAvatar = async (id) => {
		try {
			const response = await axios.get(`${BACKEND_URL}/auth/avatar`, { withCredentials: true });
			if (response.data.success) {
				localStorage.setItem('avatar', response.data.avatar);
				setAvatar(response.data.avatar);
			} else {
				localStorage.setItem('avatar', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLMI5YxZE03Vnj-s-sth2_JxlPd30Zy7yEGg&s');
				setAvatar('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLMI5YxZE03Vnj-s-sth2_JxlPd30Zy7yEGg&s');
			}
		} catch (err) {
			console.error(err);
		}
	}

	const fetchUserContentData = async () => {
		try {
			const response = await axios.get(`${BACKEND_URL}/dashboard/stats`, { withCredentials: true });
			if (response.data.success) {
				setContentData({
					voiceoverStats: { completed: response.data.data.voiceoverStats },
					thumbnailStats: { generated: response.data.data.thumbnailStats },
					scriptStats: { completed: response.data.data.scriptStats },
					SEOStats: { completed: response.data.data.SEOStats },
					videoStats: { posted: response.data.data.videoStats },
					recentProjects: response.data.data.recentProjects
				});
			}
		} catch (err) {
			console.error('Error fetching user content data:', err);
		}
	}

	const fetchTrendingTopics = async () => {
		try {
			setLoading(true); // Set loading to true before fetching
			const response = await axios.get(`${BACKEND_URL}/prompt/trending_topics`, { withCredentials: true });

			if (response.data?.response) {
				// Remove the code block formatting (```json and ```)
				const cleanedResponse = response.data.response.replace(/```json\n|\n```/g, "");

				// Parse the cleaned JSON string
				const parsedData = JSON.parse(cleanedResponse);

				if (Array.isArray(parsedData)) {
					setTrendingTopics(parsedData);
					setLoading(false); // Set loading to false after fetching
				} else {
					console.error("Parsed data is not an array:", parsedData);
				}
			} else {
				console.error("Invalid response format:", response.data);
			}
		} catch (err) {
			console.log("Error fetching trending topics:", err);
		}
	};

	const fetchChannelName = async () => {
		try {
			const response = await axios.get(`${BACKEND_URL}/auth/channel`, { withCredentials: true });
			if (response.data.success) {
				setYoutube(response.data.youtube || '');
			} else {
				setYoutube('');
			}
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		// If no local user id but backend may have set a JWT cookie after OAuth,
		// try to fetch current user from backend.
		const fetchCurrentUser = async () => {
			if (!id) {
				try {
					const res = await fetch(`${BACKEND_URL}/oauth/me`, { credentials: 'include' });
					const data = await res.json();
					if (data.success && data.user && data.user.userId) {
						const userId = data.user.userId;
						setId(userId);
						setYoutube(data.user.youtube || '');
						setAvatar(data.user.avatar || '');
					}
				} catch (err) {
					console.error('Failed to fetch current user:', err);
				}
			}
		};
		fetchCurrentUser();

		fetchAvatar();
		fetchUserContentData();
		fetchTrendingTopics();

		// Check if viewport is mobile
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	return (
		<div className={`bg-stone-50 min-h-screen ${isMobile ? 'ml-0' : 'ml-0 md:ml-64'} transition-all duration-300`}>
			<div className="p-4 md:p-6">
				<div className="mx-auto max-w-6xl">
					<div className="mb-6 md:mb-8">
						<h1 className="font-bold text-stone-800 text-xl md:text-2xl">Welcome to your Dashboard</h1>
						<p className="mt-1 text-stone-500">{youtube}</p>
					</div>

					<div className="gap-4 md:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
						{/* Voice Over Stats */}
						<div className="bg-white shadow-sm hover:shadow-md p-4 md:p-6 border border-stone-100 rounded-lg transition-shadow">
							<div className="flex items-center mb-3 md:mb-4">
								<div className="bg-purple-100 p-2 rounded">
									<svg xmlns="http://www.w3.org/2000/svg" className="w-5 md:w-6 h-5 md:h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
									</svg>
								</div>
								<h2 className="ml-3 font-medium text-stone-800 text-base md:text-lg">Voice Overs</h2>
							</div>
							<p className="font-bold text-stone-800 text-2xl md:text-3xl">{contentData.voiceoverStats.completed}</p>
							<div className="flex justify-between mt-1 text-stone-500 text-xs md:text-sm">
								<span>Completed</span>
							</div>
						</div>

						{/* Thumbnail Stats */}
						<div className="bg-white shadow-sm hover:shadow-md p-4 md:p-6 border border-stone-100 rounded-lg transition-shadow">
							<div className="flex items-center mb-3 md:mb-4">
								<div className="bg-green-100 p-2 rounded">
									<svg xmlns="http://www.w3.org/2000/svg" className="w-5 md:w-6 h-5 md:h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
								<h2 className="ml-3 font-medium text-stone-800 text-base md:text-lg">Thumbnails</h2>
							</div>
							<p className="font-bold text-stone-800 text-2xl md:text-3xl">{contentData.thumbnailStats.generated}</p>
							<div className="flex justify-between mt-1 text-stone-500 text-xs md:text-sm">
								<span>Generated</span>
							</div>
						</div>

						{/* Script Stats */}
						<div className="bg-white shadow-sm hover:shadow-md p-4 md:p-6 border border-stone-100 rounded-lg transition-shadow">
							<div className="flex items-center mb-3 md:mb-4">
								<div className="bg-blue-100 p-2 rounded">
									<svg xmlns="http://www.w3.org/2000/svg" className="w-5 md:w-6 h-5 md:h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
									</svg>
								</div>
								<h2 className="ml-3 font-medium text-stone-800 text-base md:text-lg">Scripts</h2>
							</div>
							<p className="font-bold text-stone-800 text-2xl md:text-3xl">{contentData.scriptStats.completed}</p>
							<div className="flex justify-between mt-1 text-stone-500 text-xs md:text-sm">
								<span>Completed</span>
							</div>
						</div>

						{/* SEO Stats */}
						<div className="bg-white shadow-sm hover:shadow-md p-4 md:p-6 border border-stone-100 rounded-lg transition-shadow">
							<div className="flex items-center mb-3 md:mb-4">
								<div className="bg-yellow-100 p-2 rounded">
									<svg xmlns="http://www.w3.org/2000/svg" className="w-5 md:w-6 h-5 md:h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
									</svg>
								</div>
								<h2 className="ml-3 font-medium text-stone-800 text-base md:text-lg">SEO</h2>
							</div>
							<p className="font-bold text-stone-800 text-2xl md:text-3xl">{contentData.SEOStats.completed}</p>
							<div className="flex justify-between mt-1 text-stone-500 text-xs md:text-sm">
								<span>Optimized</span>
							</div>
						</div>

						{/* Video Posts Stats */}
						<div className="bg-white shadow-sm hover:shadow-md p-4 md:p-6 border border-stone-100 rounded-lg transition-shadow">
							<div className="flex items-center mb-3 md:mb-4">
								<div className="bg-red-100 p-2 rounded">
									<svg xmlns="http://www.w3.org/2000/svg" className="w-5 md:w-6 h-5 md:h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
									</svg>
								</div>
								<h2 className="ml-3 font-medium text-stone-800 text-base md:text-lg">Videos</h2>
							</div>
							<p className="font-bold text-stone-800 text-2xl md:text-3xl">{contentData.videoStats.posted}</p>
							<div className="flex justify-between mt-1 text-stone-500 text-xs md:text-sm">
								<span>Posted</span>
							</div>
						</div>
					</div>

					{/* Recent Content Projects */}
					<div className="bg-white shadow-sm hover:shadow-md mt-6 md:mt-8 p-4 md:p-6 border border-stone-100 rounded-lg transition-shadow">
						<div className="flex justify-between items-center mb-4">
							<h2 className="font-bold text-stone-800 text-lg md:text-xl">Recent Projects</h2>
						</div>
						<div className="-mx-4 md:mx-0 overflow-x-auto">
							<div className="inline-block min-w-full align-middle">
								<div className="border border-stone-200 sm:rounded-lg overflow-hidden">
									<table className="divide-y divide-stone-200 min-w-full">
										<thead className="bg-stone-50">
											<tr>
												<th scope="col" className="px-4 py-3 font-medium text-stone-500 text-xs text-left uppercase tracking-wider">Project</th>
												<th scope="col" className="px-4 py-3 font-medium text-stone-500 text-xs text-left uppercase tracking-wider">Visibility</th>
												<th scope="col" className="px-4 py-3 font-medium text-stone-500 text-xs text-left uppercase tracking-wider">Date</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-stone-200">
											{contentData.recentProjects.map((project, index) => (
												<tr key={index} className="hover:bg-stone-50 transition-colors">
													<td className="px-4 py-3 whitespace-nowrap">
														<div className="flex items-center">
															<div className="flex-shrink-0 w-10 h-10">
																<img className="rounded w-10 h-10 object-cover" src={project.thumbnail} alt="" />
															</div>
															<div className="ml-4">
																<div className="font-medium text-stone-800 text-sm">{project.title}</div>
															</div>
														</div>
													</td>
													<td className="px-4 py-3 whitespace-nowrap">
														<StatusBadge status={project.privacy} />
													</td>
													<td className="px-4 py-3 text-stone-500 text-sm whitespace-nowrap">{project.date}</td>
												</tr>
											))}

											{
												contentData.recentProjects.length === 0 && (
													<tr>
														<td colSpan="3" className="px-4 py-3 text-stone-500 text-sm text-center">No recent projects found.</td>
													</tr>
												)
											}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

					{/* Trending Topics Section - SIMPLIFIED */}
					<div className="bg-white shadow-md hover:shadow-lg mt-6 md:mt-8 p-5 md:p-7 border border-stone-200 rounded-2xl transition-shadow">
						<div className="flex justify-between items-center mb-5">
							<h2 className="font-semibold text-stone-900 text-lg md:text-xl">Content Suggestions</h2>
							<span className="flex items-center gap-1 bg-indigo-100 px-3 py-1.5 rounded-full font-medium text-indigo-600 text-xs">
								✨ AI recommended
							</span>
						</div>

						{loading ? (
							<div className="flex justify-center py-5">
								<div className="border-4 border-t-transparent border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
							</div>
						) : (
							<ul className="space-y-4">
								{trendingTopics.map((topic, index) => (
									<li key={index} className="flex justify-between items-center py-3 border-stone-200 border-b last:border-b-0">
										<div>
											<h3 className="font-medium text-stone-900">{topic.topic}</h3>
										</div>
										<div className="shadow-sm px-3 py-1.5 rounded-full font-semibold text-blue-600 text-xs">
											{topic.popularity}% Hot
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

// Helper component for status badges
const StatusBadge = ({ status }) => {
	let bgColor = "bg-gray-100";
	let textColor = "text-gray-800";

	switch (status) {
		case "private":
			bgColor = "bg-red-100";
			textColor = "text-red-800";
			break;
		case "public":
			bgColor = "bg-green-100";
			textColor = "text-green-800";
			break;
		case "unlisted":
			bgColor = "bg-orange-100";
			textColor = "text-orange-800";
			break;
	}

	return (
		<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
			{status}
		</span>
	);
};

export default Dashboard;