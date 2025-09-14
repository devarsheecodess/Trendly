import React, { useState, useEffect } from 'react';
import { CalendarIcon, Clock, Film, FileText, Youtube, Image, Search, ChevronRight, Mic } from 'lucide-react';
import DetailPopup from './DetailPopup';
import axios from 'axios';

const History = () => {
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
	const [activeTab, setActiveTab] = useState("all");
	const [userId, setUserId] = useState(localStorage.getItem("userId"));

	// Sample data for demonstration
	const [activities, setActivities] = useState({ scripts: [], voiceDubbings: [], thumbnails: [], seoAnalyses: [], youtubePosts: [] });

	const handleExport = async (e, url, id) => {
		e.preventDefault();
		if (!url) return;
		let link

		try {
			const response = await axios.get(`${BACKEND_URL}/thumbnail/download`, {
				params: { imageUrl: encodeURIComponent(url) },
				responseType: 'blob'
			});

			if (response.status !== 200) {
				throw new Error("Failed to download image");
			}

			const blob = new Blob([response.data], { type: 'image/png' });
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = `thumbnail-${id}}.jpg`;

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

		} catch (error) {
			console.error('Error exporting thumbnail:', error.message);
		} finally {
			if (link) {
				URL.revokeObjectURL(link.href);
			}
		}
	};


	const formatDuration = (duration) => {
		const totalSeconds = parseFloat(duration); // Ensure it's a number

		if (isNaN(totalSeconds)) return "Unknown duration";

		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = Math.floor(totalSeconds % 60);

		let formattedDuration = "";

		if (hours > 0) formattedDuration += `${hours} hrs `;
		if (minutes > 0) formattedDuration += `${minutes} mins `;
		if (seconds > 0 || formattedDuration === "") formattedDuration += `${seconds} secs`;

		return formattedDuration.trim();
	};

	const playvoiceover = (e, url) => {
		e.preventDefault();
		const audio = new Audio(url);
		audio.play();
	}

	const fetchScripts = async () => {
		try {
			const response = await axios.get(`${BACKEND_URL}/history/scripts`, { withCredentials: true });
			if (response.data.success) {
				setActivities(prev => ({ ...prev, scripts: response.data.scripts }));
			}
		} catch (err) {
			console.log(err)
		}
	}

	const fetchSEOs = async () => {
		try {
			const response = await axios.get(`${BACKEND_URL}/history/seos`, { withCredentials: true });
			if (response.data.success) {
				setActivities(prev => ({ ...prev, seoAnalyses: response.data.seos }));
			}
		} catch (err) {
			console.log(err)
		}
	}

	const fetchThumbnails = async () => {
		try {
			const response = await axios.get(`${BACKEND_URL}/history/thumbnails`, { withCredentials: true });
			if (response.data.success) {
				setActivities(prev => ({ ...prev, thumbnails: response.data.thumbnails }));
			}
		} catch (err) {
			console.log(err)
		}
	}

	const fetchVoiceDubbings = async () => {
		try {
			const response = await axios.get(`${BACKEND_URL}/history/voiceovers`, { withCredentials: true });
			if (response.data.success) {
				setActivities(prev => ({ ...prev, voiceDubbings: response.data.voiceovers }));
			}
		} catch (err) {
			console.log(err)
		}
	}

	const fetchYoutubePosts = async () => {
		try {
			const response = await axios.get(`${BACKEND_URL}/history/youtube`, { withCredentials: true });
			if (response.data.success) {
				setActivities(prev => ({ ...prev, youtubePosts: response.data.videos }));
				console.log(response.data.videos)
			}
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		fetchScripts();
		fetchSEOs();
		fetchThumbnails();
		fetchVoiceDubbings();
		fetchYoutubePosts();
	}, []);

	// Inside your History component, add the following state:
	const [detailPopup, setDetailPopup] = useState({
		isOpen: false,
		itemType: '',
		itemData: null
	});

	// Add this function to handle opening the popup
	const openDetailPopup = (type, data) => {
		setDetailPopup({
			isOpen: true,
			itemType: type,
			itemData: data
		});
	};

	// Add this function to handle closing the popup
	const closeDetailPopup = () => {
		setDetailPopup(prev => ({
			...prev,
			isOpen: false
		}));
	};

	// Custom tab component
	const TabButton = ({ id, label, active, onClick }) => (
		<button
			onClick={() => onClick(id)}
			className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${active
				? "text-stone-800 border-b-2 border-stone-800 bg-stone-100"
				: "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
				}`}
		>
			{label}
		</button>
	);

	const handleViewAll = (tab) => {
		setActiveTab(tab);
	};

	// Custom card component
	const ActivityCard = ({ children, className = "" }) => (
		<div className={`bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
			{children}
		</div>
	);

	// Function to render different content based on active tab
	const renderTabContent = () => {
		if (activeTab === "all") {
			return (
				<div className="space-y-8">
					{/* Scripts Section */}
					<div>
						<div className="flex justify-between items-center mb-4">
							<h2 className="flex items-center font-semibold text-stone-800 text-xl">
								<FileText className="mr-2 w-5 h-5 text-stone-600" />
								Recent Scripts
							</h2>
							<button onClick={() => handleViewAll("scripts")} className="flex items-center text-stone-600 hover:text-stone-800 text-sm">
								View all <ChevronRight className="ml-1 w-4 h-4" />
							</button>
						</div>
						<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{activities.scripts.slice(0, 3).map(script => (
								<ActivityCard key={script.id}>
									<div className="p-4">
										<h3 className="mb-2 font-medium text-stone-800 truncate">{script.title}</h3>
										<div className="flex justify-between text-stone-500 text-sm">
											<span>
												{new Date(script.createdAt).toLocaleDateString("en-GB", {
													day: "2-digit",
													month: "long",
													year: "numeric",
												})}
											</span>
										</div>
									</div>
									<div className="flex justify-between items-center bg-stone-50 px-4 py-2 border-stone-100 border-t">
										<span className="text-stone-600 text-sm"></span>
										<button
											className="text-stone-600 hover:text-stone-800 text-sm"
											onClick={() => openDetailPopup('script', script)}
										>
											View
										</button>
									</div>
								</ActivityCard>
							))}

							{
								activities.scripts.length === 0 && (
									<div className="flex flex-col justify-center items-center col-span-1 md:col-span-2 lg:col-span-3 bg-stone-50 py-12 border border-stone-200 border-dashed rounded-lg text-center">
										<FileText className="mb-3 w-12 h-12 text-stone-300" />
										<p className="mb-1 font-medium text-stone-500 text-lg">No scripts found</p>
										<p className="text-stone-400 text-sm">Scripts you create will appear here</p>
									</div>
								)
							}
						</div>
					</div>

					{/* Voice Dubbings Section */}
					<div>
						<div className="flex justify-between items-center mb-4">
							<h2 className="flex items-center font-semibold text-stone-800 text-xl">
								<Film className="mr-2 w-5 h-5 text-stone-600" />
								Voice Dubbings
							</h2>
							<button onClick={() => handleViewAll("voiceDubbings")} className="flex items-center text-stone-600 hover:text-stone-800 text-sm">
								View all <ChevronRight className="ml-1 w-4 h-4" />
							</button>
						</div>
						<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{activities.voiceDubbings.slice(0, 3).map(dubbing => (
								<ActivityCard key={dubbing.id}>
									<div className="p-4">
										<h3 className="mb-2 font-medium text-stone-800 truncate">{dubbing.title}</h3>
										<div className="flex justify-between text-stone-500 text-sm">
											<span>
												{new Date(dubbing.createdAt).toLocaleString("en-GB", {
													day: "2-digit",
													month: "long",
													year: "numeric"
												})}
											</span>
											<span>{formatDuration(dubbing.duration)}</span>
										</div>
									</div>
									<div className="flex justify-between items-center bg-stone-50 px-4 py-2 border-stone-100 border-t">
										<span className="text-stone-600 text-sm">Voice: {dubbing.voice}</span>
										<button onClick={(e) => playvoiceover(e, dubbing.voiceover)} className="flex items-center text-stone-600 hover:text-stone-800 text-sm">
											<Clock className="mr-1 w-4 h-4" /> Play
										</button>
									</div>
								</ActivityCard>
							))}

							{
								activities.voiceDubbings.length === 0 && (
									<div className="flex flex-col justify-center items-center col-span-1 md:col-span-2 lg:col-span-3 bg-stone-50 py-12 border border-stone-200 border-dashed rounded-lg text-center">
										<Mic className="mb-3 w-12 h-12 text-stone-300" /> {/* Changed icon here */}
										<p className="mb-1 font-medium text-stone-500 text-lg">No voiceovers found</p>
										<p className="text-stone-400 text-sm">Voiceovers you create will appear here</p>
									</div>
								)
							}
						</div>
					</div>

					{/* Thumbnails Section */}
					<div>
						<div className="flex justify-between items-center mb-4">
							<h2 className="flex items-center font-semibold text-stone-800 text-xl">
								<Image className="mr-2 w-5 h-5 text-stone-600" />
								Thumbnails
							</h2>
							<button
								onClick={() => handleViewAll("thumbnails")}
								className="flex items-center text-stone-600 hover:text-stone-800 text-sm"
							>
								View all <ChevronRight className="ml-1 w-4 h-4" />
							</button>
						</div>
						<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{activities.thumbnails.slice(0, 3).map(thumbnail => (
								<ActivityCard key={thumbnail._id}>
									<div className="relative overflow-hidden" style={{ paddingTop: "56.25%" }}>
										<img
											src={thumbnail.thumbnail}
											alt={`Thumbnail for ${thumbnail.title}`}
											className="top-0 left-0 absolute w-full h-full object-cover"
										/>
									</div>
									<div className="p-4">
										<h3 className="mb-2 font-medium text-stone-800 truncate">{thumbnail.title}</h3>
										<div className="flex justify-between text-stone-500 text-sm">
											<span>
												{new Date(thumbnail.createdAt).toLocaleDateString("en-GB", {
													day: "2-digit",
													month: "long",
													year: "numeric",
												})}
											</span>
										</div>
									</div>
									<div className="flex justify-between items-center bg-stone-50 px-4 py-2 border-stone-100 border-t">
										<span className="text-stone-600 text-sm"></span>
										<button onClick={(e) => handleExport(e, thumbnail.thumbnail, thumbnail._id)} className="text-stone-600 hover:text-stone-800 text-sm">Download</button>
									</div>
								</ActivityCard>
							))}

							{
								activities.thumbnails.length === 0 && (
									<div className="flex flex-col justify-center items-center col-span-1 md:col-span-2 lg:col-span-3 bg-stone-50 py-12 border border-stone-200 border-dashed rounded-lg text-center">
										<Image className="mb-3 w-12 h-12 text-stone-300" /> {/* Changed icon here */}
										<p className="mb-1 font-medium text-stone-500 text-lg">No thumbnails found</p>
										<p className="text-stone-400 text-sm">Thumbnails you create will appear here</p>
									</div>
								)
							}
						</div>
					</div>


					{/* SEO Section */}
					<div>
						<div className="flex justify-between items-center mb-4">
							<h2 className="flex items-center font-semibold text-stone-800 text-xl">
								<Search className="mr-2 w-5 h-5 text-stone-600" />
								SEO Analysis
							</h2>
							<button onClick={() => handleViewAll("seoAnalyses")} className="flex items-center text-stone-600 hover:text-stone-800 text-sm">
								View all <ChevronRight className="ml-1 w-4 h-4" />
							</button>
						</div>
						<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{activities.seoAnalyses.slice(0, 3).map(seo => (
								<ActivityCard key={seo._id}>
									<div className="p-4">
										<h3 className="mb-2 font-medium text-stone-800 truncate">{seo.optimizedTitle}</h3>
										<div className="flex justify-between text-stone-500 text-sm">
											<span>
												{new Date(seo.createdAt).toLocaleDateString("en-GB", {
													day: "2-digit",
													month: "long",
													year: "numeric",
												})}
											</span>
										</div>
									</div>
									<div className="flex justify-between items-center bg-stone-50 px-4 py-2 border-stone-100 border-t">
										<div className="flex items-center">
											<div className="bg-stone-200 rounded-full w-16 h-2 overflow-hidden">
												<div
													className={`h-full rounded-full ${seo.titleScore > 75
														? "bg-green-500"
														: seo.titleScore > 50
															? "bg-yellow-500"
															: "bg-red-500"
														}`}
													style={{ width: `${seo.titleScore}%` }}
												></div>
											</div>
											<span className="ml-2 text-stone-600 text-sm">{seo.titleScore}%</span>
										</div>
										<button
											className="text-stone-600 hover:text-stone-800 text-sm"
											onClick={() => openDetailPopup('seo', seo)}
										>
											Details
										</button>
									</div>
								</ActivityCard>
							))}

							{
								activities.seoAnalyses.length === 0 && (
									<div className="flex flex-col justify-center items-center col-span-1 md:col-span-2 lg:col-span-3 bg-stone-50 py-12 border border-stone-200 border-dashed rounded-lg text-center">
										<Search className="mb-3 w-12 h-12 text-stone-300" /> {/* Changed icon here */}
										<p className="mb-1 font-medium text-stone-500 text-lg">No SEO Analysis found</p>
										<p className="text-stone-400 text-sm">SEO Analysis you do will appear here</p>
									</div>
								)
							}
						</div>
					</div>

					{/* YouTube Posts Section */}
					<div>
						<div className="flex justify-between items-center mb-4">
							<h2 className="flex items-center font-semibold text-stone-800 text-xl">
								<Youtube className="mr-2 w-5 h-5 text-stone-600" />
								YouTube Posts
							</h2>
							<button onClick={() => handleViewAll("youtubePosts")} className="flex items-center text-stone-600 hover:text-stone-800 text-sm">
								View all <ChevronRight className="ml-1 w-4 h-4" />
							</button>
						</div>
						<div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{activities.youtubePosts.slice(0, 3).map(post => (
								<ActivityCard key={post._id} className="shadow-sm hover:shadow-md overflow-hidden transition-shadow duration-200">
									<div className="p-4">
										<div className="flex space-x-4">
											{/* Square thumbnail */}
											<div className="flex-shrink-0">
												<img
													src={post.thumbnail}
													alt={post.title}
													className="rounded-md w-16 h-16 object-cover"
												/>
											</div>

											{/* Title and date */}
											<div className="flex-grow min-w-0">
												<h3 className="mb-2 font-medium text-stone-800 truncate">{post.title}</h3>
												<div className="text-stone-500 text-sm">
													<span>{new Date(post.createdAt).toLocaleDateString("en-GB", {
														day: "numeric",
														month: "long",
														year: "numeric"
													})}</span>
												</div>
											</div>
										</div>

										{/* Description or additional content can go here */}
										<div className="mt-4 text-stone-600 text-sm line-clamp-2">
											{post.description || "Watch this video on YouTube"}
										</div>
									</div>

									<div className="flex justify-between items-center bg-stone-50 px-4 py-3 border-stone-100 border-t">
										<a
											href={post.video}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center font-medium text-stone-600 hover:text-stone-800 text-sm"
										>
											<span>Watch on YouTube</span>
											<svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
											</svg>
										</a>
									</div>
								</ActivityCard>
							))}

							{
								activities.youtubePosts.length === 0 && (
									<div className="flex flex-col justify-center items-center col-span-1 md:col-span-2 lg:col-span-3 bg-stone-50 py-12 border border-stone-200 border-dashed rounded-lg text-center">
										<Youtube className="mb-3 w-12 h-12 text-stone-300" /> {/* Changed icon here */}
										<p className="mb-1 font-medium text-stone-500 text-lg">No YouTube videos found</p>
										<p className="text-stone-400 text-sm">Videos you post will appear here</p>
									</div>
								)
							}
						</div>
					</div>
				</div>
			);
		} else {
			// Render specific content for each tab
			const tabData = activities[activeTab] || [];
			const renderItems = () => {
				switch (activeTab) {
					case "scripts":
						return (
							<>
								{tabData.map(script => (
									<ActivityCard key={script.id} className="flex flex-col h-full">
										<div className="flex-grow p-4">
											<h3 className="mb-2 font-medium text-stone-800">{script.title}</h3>
											<div className="flex justify-between text-stone-500 text-sm">
												<span>
													{new Date(script.createdAt).toLocaleDateString("en-GB", {
														day: "2-digit",
														month: "long",
														year: "numeric",
													})}
												</span>
											</div>
										</div>
										<div className="flex justify-between items-center bg-stone-50 px-4 py-2 border-stone-100 border-t">
											<span className="text-stone-600 text-sm"></span>
											<button
												className="text-stone-600 hover:text-stone-800 text-sm"
												onClick={() => openDetailPopup('script', script)}
											>
												View
											</button>
										</div>
									</ActivityCard>
								))}

								{/* Show "No scripts found" message only when there are no scripts */}
								{activities.scripts.length === 0 && (
									<div className="flex flex-col justify-center items-center col-span-1 md:col-span-2 lg:col-span-3 bg-stone-50 py-12 border border-stone-200 border-dashed rounded-lg text-center">
										<FileText className="mb-3 w-12 h-12 text-stone-300" />
										<p className="mb-1 font-medium text-stone-500 text-lg">No scripts found</p>
										<p className="text-stone-400 text-sm">Scripts you create will appear here</p>
									</div>
								)}
							</>
						);
					case "voiceDubbings":
						return (
							<>
								{tabData.map(dubbing => (
									<ActivityCard key={dubbing.id} className="flex flex-col h-full">
										<div className="flex-grow p-4">
											<h3 className="mb-2 font-medium text-stone-800">{dubbing.title}</h3>
											<div className="flex justify-between text-stone-500 text-sm">
												<span>{new Date(dubbing.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</span>
												<span>{dubbing.duration}</span>
											</div>
										</div>
										<div className="flex justify-between items-center bg-stone-50 px-4 py-2 border-stone-100 border-t">
											<span className="text-stone-600 text-sm">Voice: {dubbing.voice}</span>
											<button onClick={(e) => playvoiceover(e, dubbing.voiceover)} className="flex items-center text-stone-600 hover:text-stone-800 text-sm">
												<Clock className="mr-1 w-4 h-4" /> Play
											</button>
										</div>
									</ActivityCard>
								))}

								{tabData.length === 0 && (
									<div className="flex flex-col justify-center items-center col-span-1 md:col-span-2 lg:col-span-3 bg-stone-50 py-12 border border-stone-200 border-dashed rounded-lg text-center">
										<Mic className="mb-3 w-12 h-12 text-stone-300" />  {/* 🎙️ Microphone Icon */}
										<p className="mb-1 font-medium text-stone-500 text-lg">No voiceovers found</p>
										<p className="text-stone-400 text-sm">Voiceovers you create will appear here</p>
									</div>
								)}
							</>
						);

					case "thumbnails":
						return (
							<>
								{tabData.map(thumbnail => (
									<ActivityCard key={thumbnail.id} className="flex flex-col h-full">
										<div className="relative overflow-hidden" style={{ paddingTop: "56.25%" }}>
											<img src={thumbnail.thumbnail} alt={thumbnail.title} className="top-0 left-0 absolute w-full h-full object-cover" />
										</div>
										<div className="flex-grow p-4">
											<h3 className="mb-2 font-medium text-stone-800">{thumbnail.title}</h3>
											<div className="flex justify-between text-stone-500 text-sm">
												<span>{new Date(thumbnail.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</span>
											</div>
										</div>
										<div className="flex justify-between items-center bg-stone-50 px-4 py-2 border-stone-100 border-t">
											<button onClick={(e) => handleExport(e, thumbnail.thumbnail, thumbnail._id)} className="text-stone-600 hover:text-stone-800 text-sm">Download</button>
										</div>
									</ActivityCard>
								))}

								{tabData.length === 0 && (
									<div className="flex flex-col justify-center items-center col-span-1 md:col-span-2 lg:col-span-3 bg-stone-50 py-12 border border-stone-200 border-dashed rounded-lg text-center">
										<Image className="mb-3 w-12 h-12 text-stone-300" />  {/* 🖼️ Image Icon */}
										<p className="mb-1 font-medium text-stone-500 text-lg">No thumbnails found</p>
										<p className="text-stone-400 text-sm">Thumbnails you create will appear here</p>
									</div>
								)}
							</>
						);

					case "seoAnalyses":
						return (
							<>
								{tabData.map(seo => (
									<ActivityCard key={seo.id} className="flex flex-col h-full">
										<div className="flex-grow p-4">
											<h3 className="mb-2 font-medium text-stone-800">{seo.optimizedTitle}</h3>
											<div className="flex justify-between text-stone-500 text-sm">
												<span>{new Date(seo.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</span>
												<span>{seo.primaryKeywords.length} keywords</span>
											</div>
										</div>
										<div className="flex justify-between items-center bg-stone-50 px-4 py-2 border-stone-100 border-t">
											<div className="flex items-center">
												<div className="bg-stone-200 rounded-full w-16 h-2 overflow-hidden">
													<div className={`h-full rounded-full ${seo.titleScore > 75 ? "bg-green-500" : seo.titleScore > 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${seo.titleScore}%` }}></div>
												</div>
												<span className="ml-2 text-stone-600 text-sm">{seo.titleScore}%</span>
											</div>
											<button className="text-stone-600 hover:text-stone-800 text-sm" onClick={() => openDetailPopup('seo', seo)}>Details</button>
										</div>
									</ActivityCard>
								))}

								{tabData.length === 0 && (
									<div className="flex flex-col justify-center items-center col-span-1 md:col-span-2 lg:col-span-3 bg-stone-50 py-12 border border-stone-200 border-dashed rounded-lg text-center">
										<Search className="mb-3 w-12 h-12 text-stone-300" />
										<p className="mb-1 font-medium text-stone-500 text-lg">No SEO Analysis found</p>
										<p className="text-stone-400 text-sm">SEO Analysis you do will appear here</p>
									</div>
								)}
							</>
						);

					case "youtubePosts":
						return (
							<>
								{tabData.map(post => (
									<ActivityCard key={post.id} className="flex flex-col h-full">
										<div className="p-4">
											<div className="flex space-x-4">
												<div className="flex-shrink-0">
													<img src={post.thumbnail} alt={post.title} className="rounded-md w-16 h-16 object-cover" />
												</div>
												<div className="flex-grow min-w-0">
													<h3 className="mb-2 font-medium text-stone-800 truncate">{post.title}</h3>
													<div className="text-stone-500 text-sm">
														<span>{new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
													</div>
												</div>
											</div>
											<div className="mt-4 text-stone-600 text-sm line-clamp-2">{post.description || "Watch this video on YouTube"}</div>
										</div>
										<div className="flex justify-between items-center bg-stone-50 px-4 py-3 border-stone-100 border-t">
											<a href={post.video} target="_blank" rel="noopener noreferrer" className="flex items-center font-medium text-blue-600 hover:text-blue-800 text-sm">Watch on YouTube</a>
										</div>
									</ActivityCard>
								))}

								{tabData.length === 0 && (
									<div className="flex flex-col justify-center items-center col-span-1 md:col-span-2 lg:col-span-3 bg-stone-50 py-12 border border-stone-200 border-dashed rounded-lg text-center">
										<Youtube className="mb-3 w-12 h-12 text-stone-300" />  {/* 🎥 Video Icon */}
										<p className="mb-1 font-medium text-stone-500 text-lg">No YouTube posts found</p>
										<p className="text-stone-400 text-sm">Your YouTube posts will appear here</p>
									</div>
								)}
							</>
						);
					default:
						return <p>No data available.</p>;
				}
			};

			return (
				<div>
					<div className="flex justify-between items-center mb-6">
						<h2 className="font-semibold text-stone-800 text-xl">
							{activeTab === "scripts" && <FileText className="inline mr-2 w-5 h-5 text-stone-600" />}
							{activeTab === "voiceDubbings" && <Film className="inline mr-2 w-5 h-5 text-stone-600" />}
							{activeTab === "thumbnails" && <Image className="inline mr-2 w-5 h-5 text-stone-600" />}
							{activeTab === "seoAnalyses" && <Search className="inline mr-2 w-5 h-5 text-stone-600" />}
							{activeTab === "youtubePosts" && <Youtube className="inline mr-2 w-5 h-5 text-stone-600" />}
							{activeTab === "scripts" && "All Scripts"}
							{activeTab === "voiceDubbings" && "All Voice Dubbings"}
							{activeTab === "thumbnails" && "All Thumbnails"}
							{activeTab === "seoAnalyses" && "All SEO Analyses"}
							{activeTab === "youtubePosts" && "All YouTube Posts"}
						</h2>
					</div>

					<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
						{renderItems()}
					</div>
				</div>
			);
		}
	};

	return (
		<div className="bg-stone-50 md:ml-64 p-4 md:p-6 min-h-screen">
			<div className="mx-auto max-w-6xl">
				<div className="flex justify-between items-center mb-6">
					<h1 className="font-bold text-stone-800 text-3xl">History</h1>
				</div>

				<div className="mb-6 border-stone-200 border-b">
					<div className="flex pb-1 overflow-x-auto">
						<TabButton id="all" label="All Activity" active={activeTab === "all"} onClick={setActiveTab} />
						<TabButton id="scripts" label="Scripts" active={activeTab === "scripts"} onClick={setActiveTab} />
						<TabButton id="voiceDubbings" label="Voice Dubbings" active={activeTab === "voiceDubbings"} onClick={setActiveTab} />
						<TabButton id="thumbnails" label="Thumbnails" active={activeTab === "thumbnails"} onClick={setActiveTab} />
						<TabButton id="seoAnalyses" label="SEO Analysis" active={activeTab === "seoAnalyses"} onClick={setActiveTab} />
						<TabButton id="youtubePosts" label="YouTube Posts" active={activeTab === "youtubePosts"} onClick={setActiveTab} />
					</div>
				</div>

				{renderTabContent()}
			</div>
			<DetailPopup
				isOpen={detailPopup.isOpen}
				onClose={closeDetailPopup}
				itemType={detailPopup.itemType}
				itemData={detailPopup.itemData}
			/>
		</div>
	);
};

export default History;