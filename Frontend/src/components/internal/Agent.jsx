import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Mic, MicOff, Bot, User, Plus, MessageSquare, Search } from 'lucide-react';

const Agent = () => {
	const [messages, setMessages] = useState([
		{
			id: 1,
			text: "Hello! I'm your AI agent. How can I help you today?",
			sender: 'agent',
			timestamp: new Date()
		}
	]);
	const [inputMessage, setInputMessage] = useState('');
	const [isRecording, setIsRecording] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const [userAvatar, setUserAvatar] = useState('');
	const [activeChat, setActiveChat] = useState(1);
	const [recentChats] = useState([
		{ id: 1, title: "Content Creation Help", preview: "Hello! I'm your AI agent...", timestamp: new Date(), active: true },
		{ id: 2, title: "Marketing Strategy", preview: "Can you help me with social media...", timestamp: new Date(Date.now() - 86400000), active: false },
		{ id: 3, title: "Script Writing", preview: "I need help writing a video script...", timestamp: new Date(Date.now() - 172800000), active: false },
		{ id: 4, title: "SEO Optimization", preview: "How can I improve my website's SEO...", timestamp: new Date(Date.now() - 259200000), active: false },
		{ id: 5, title: "Thumbnail Ideas", preview: "What makes a good YouTube thumbnail...", timestamp: new Date(Date.now() - 345600000), active: false }
	]);
	const messagesEndRef = useRef(null);
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		const storedAvatar = localStorage.getItem('avatar');
		if (storedAvatar) {
			setUserAvatar(storedAvatar);
		}
	}, []);

	const handleSendMessage = () => {
		if (!inputMessage.trim()) return;

		const prompt = inputMessage;

		const newMessage = {
			id: Date.now(),
			text: inputMessage,
			sender: 'user',
			timestamp: new Date()
		};

		setMessages(prev => [...prev, newMessage]);
		setInputMessage('');
		setIsTyping(true);

		// Send prompt to backend /agent/chat with Bearer token from localStorage
		const token = localStorage.getItem('token');
		axios.get(`${BACKEND_URL}/agent/chat`, {
			params: { prompt },
			headers: { Authorization: token ? `Bearer ${token}` : '' }
		})
			.then((res) => {
				const text = res?.data?.response || 'No response from agent';
				const agentResponse = {
					id: Date.now() + 1,
					text,
					sender: 'agent',
					timestamp: new Date()
				};
				console.log(res)
				setMessages(prev => [...prev, agentResponse]);
			})
			.catch((err) => {
				console.error('Agent error', err?.response || err);
				const agentResponse = {
					id: Date.now() + 1,
					text: 'Sorry, something went wrong. Please try again.',
					sender: 'agent',
					timestamp: new Date()
				};
				setMessages(prev => [...prev, agentResponse]);
			})
			.finally(() => setIsTyping(false));
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const toggleRecording = () => {
		setIsRecording(!isRecording);
		if (!isRecording) {
			setTimeout(() => {
				setInputMessage(prev => prev + "Voice message transcribed here...");
				setIsRecording(false);
			}, 2000);
		}
	};

	const formatTime = (date) => {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	return (
		<div className="bg-stone-50 p-3 sm:p-4 md:p-6 md:pl-72 lg:pl-72 w-full min-h-screen">
			<div className="mx-auto max-w-7xl h-full">
				<div className="mb-6 md:text-left text-center">
					<h1 className="mb-2 font-bold text-stone-900 text-2xl sm:text-3xl md:text-4xl">AI Agent</h1>
					<p className="text-stone-600 text-sm md:text-base">Create instant content with AI</p>
				</div>

				<div className="flex gap-6 h-[calc(100vh-180px)] md:h-[calc(100vh-160px)]">
					{/* Recent Chats Sidebar */}
					<div className="flex flex-col bg-white shadow-xl border border-stone-200/50 rounded-2xl w-80 overflow-hidden">
						{/* Sidebar Header */}
						<div className="p-4 border-stone-200/50 border-b">
							<button className="flex justify-center items-center space-x-2 bg-stone-700 hover:bg-stone-800 shadow-md hover:shadow-lg px-4 py-3 rounded-xl w-full text-white transition-all duration-200">
								<Plus className="w-4 h-4" />
								<span className="font-medium">New Chat</span>
							</button>
						</div>

						{/* Search Bar */}
						<div className="p-4 border-stone-200/50 border-b">
							<div className="relative">
								<Search className="top-1/2 left-3 absolute w-4 h-4 text-stone-400 -translate-y-1/2 transform" />
								<input
									type="text"
									placeholder="Search chats..."
									className="bg-stone-50 py-2 pr-4 pl-10 border border-stone-300 focus:border-stone-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500/50 w-full text-sm"
								/>
							</div>
						</div>

						{/* Recent Chats List */}
						<div className="flex-1 overflow-y-auto">
							<div className="p-2">
								{recentChats.map((chat) => (
									<div
										key={chat.id}
										onClick={() => setActiveChat(chat.id)}
										className={`p-3 rounded-xl cursor-pointer transition-all duration-200 mb-2 ${activeChat === chat.id
											? 'bg-stone-100 border-l-4 border-stone-600'
											: 'hover:bg-stone-50'
											}`}
									>
										<div className="flex items-start space-x-3">
											<div className="flex flex-shrink-0 justify-center items-center bg-stone-600 rounded-lg w-8 h-8">
												<MessageSquare className="w-4 h-4 text-white" />
											</div>
											<div className="flex-1 min-w-0">
												<h3 className={`font-medium text-sm truncate ${activeChat === chat.id ? 'text-stone-800' : 'text-stone-800'
													}`}>
													{chat.title}
												</h3>
												<p className="mt-1 text-stone-500 text-xs truncate">
													{chat.preview}
												</p>
												<p className="mt-1 text-stone-400 text-xs">
													{chat.timestamp.toLocaleDateString()}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Chat Container */}
					<div className="flex flex-col flex-1 bg-white shadow-2xl backdrop-blur-sm border border-stone-200/50 rounded-3xl overflow-hidden">

						{/* Messages Area */}
						<div className="flex-1 space-y-6 bg-gradient-to-b from-white via-stone-50/30 to-white p-6 overflow-y-auto">
							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
								>
									<div className={`flex items-end space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
										{/* Avatar */}
										<div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden ${message.sender === 'user'
											? 'bg-stone-700 text-white'
											: 'bg-stone-600 text-white'
											}`}>
											{message.sender === 'user' ? (
												userAvatar ? (
													<img
														src={userAvatar}
														alt="User Avatar"
														className="rounded-2xl w-full h-full object-cover"
													/>
												) : (
													<User className="w-5 h-5" />
												)
											) : (
												<Bot className="w-5 h-5" />
											)}
										</div>

										{/* Message Bubble */}
										<div className={`rounded-3xl px-5 py-3 shadow-lg backdrop-blur-sm border ${message.sender === 'user'
											? 'bg-stone-700 text-white border-stone-600/20 rounded-br-xl'
											: 'bg-white text-stone-800 border-stone-200/50 rounded-bl-xl'
											}`}>
											<p className="font-medium text-sm leading-relaxed">{message.text}</p>
											<p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-stone-300' : 'text-stone-500'
												}`}>
												{formatTime(message.timestamp)}
											</p>
										</div>
									</div>
								</div>
							))}

							{/* Typing Indicator */}
							{isTyping && (
								<div className="flex justify-start animate-fadeIn">
									<div className="flex items-end space-x-3 max-w-[80%]">
										<div className="flex justify-center items-center bg-stone-600 shadow-lg rounded-2xl w-10 h-10 text-white">
											<Bot className="w-5 h-5" />
										</div>
										<div className="bg-white shadow-lg px-5 py-3 border border-stone-200/50 rounded-3xl rounded-bl-xl">
											<div className="flex space-x-2">
												<div className="bg-stone-500 rounded-full w-2 h-2 animate-bounce"></div>
												<div className="bg-stone-500 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
												<div className="bg-stone-500 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
											</div>
										</div>
									</div>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>

						{/* Input Area */}
						<div className="bg-white backdrop-blur-sm p-6 border-stone-200/50 border-t">
							<div className="flex items-center space-x-4 w-full">
								{/* Voice Recording Button */}
								<button
									onClick={toggleRecording}
									className={`flex-shrink-0 p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg ${isRecording
										? 'bg-red-500 text-white shadow-red-200 animate-pulse'
										: 'bg-stone-100 hover:bg-stone-200 text-stone-600 shadow-stone-200'
										}`}
								>
									{isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
								</button>

								{/* Message Input */}
								<div className="flex-1">
									<textarea
										value={inputMessage}
										onChange={(e) => setInputMessage(e.target.value)}
										onKeyPress={handleKeyPress}
										placeholder="Type your message..."
										className="bg-stone-50 shadow-inner p-4 border-2 border-stone-200/50 focus:border-stone-500/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-500/50 w-full text-stone-800 text-sm transition-all duration-300 resize-none placeholder-stone-400"
										rows="1"
										style={{ minHeight: '50px', maxHeight: '120px' }}
									/>
								</div>

								{/* Send Button */}
								<button
									onClick={handleSendMessage}
									disabled={!inputMessage.trim()}
									className="flex-shrink-0 bg-stone-700 hover:bg-stone-800 disabled:bg-stone-300 shadow-lg hover:shadow-stone-300 disabled:shadow-stone-200 p-3 rounded-2xl text-white hover:scale-105 disabled:hover:scale-100 transition-all duration-300 disabled:cursor-not-allowed transform"
								>
									<Send className="w-5 h-5" />
								</button>
							</div>

							{/* Recording Indicator */}
							{isRecording && (
								<div className="flex justify-center items-center space-x-3 mt-4 text-red-600 animate-fadeIn">
									<div className="bg-red-500 shadow-lg rounded-full w-4 h-4 animate-pulse"></div>
									<span className="font-semibold text-sm">Recording... Tap mic to stop</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
			@keyframes fadeIn {
				from { opacity: 0; transform: translateY(20px); }
				to { opacity: 1; transform: translateY(0); }
			}
			.animate-fadeIn {
				animation: fadeIn 0.5s ease-out;
			}
		`}</style>
		</div>
	);
};

export default Agent;