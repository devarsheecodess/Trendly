import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot, User } from 'lucide-react';

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
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		// Get user avatar from localStorage
		const storedAvatar = localStorage.getItem('avatar');
		if (storedAvatar) {
			setUserAvatar(storedAvatar);
		}
	}, []);

	const handleSendMessage = () => {
		if (!inputMessage.trim()) return;

		const newMessage = {
			id: Date.now(),
			text: inputMessage,
			sender: 'user',
			timestamp: new Date()
		};

		setMessages(prev => [...prev, newMessage]);
		setInputMessage('');
		setIsTyping(true);

		// Simulate agent response
		setTimeout(() => {
			const agentResponse = {
				id: Date.now() + 1,
				text: "I understand your request. Let me help you with that!",
				sender: 'agent',
				timestamp: new Date()
			};
			setMessages(prev => [...prev, agentResponse]);
			setIsTyping(false);
		}, 1500);
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
			// Simulate recording
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
		<div className="bg-gradient-to-br from-stone-50 to-stone-100 p-3 sm:p-4 md:p-6 md:pl-72 lg:pl-72 w-full min-h-screen">
			<div className="mx-auto max-w-6xl h-full">
				<div className="mb-8 md:text-left text-center">
					<h1 className="mb-2 font-bold text-stone-900 text-2xl sm:text-3xl md:text-4xl">AI Agent</h1>
					<p className="text-stone-600 text-sm md:text-base">Create instant content with AI</p>
				</div>

				{/* Chat Container */}
				<div className="flex flex-col bg-white shadow-2xl backdrop-blur-sm border border-stone-200/50 rounded-3xl h-[calc(100vh-180px)] md:h-[calc(100vh-160px)] overflow-hidden">

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
										? 'bg-gradient-to-br from-stone-700 to-stone-800 text-white'
										: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
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
										? 'bg-gradient-to-br from-stone-700 to-stone-800 text-white border-stone-600/20 rounded-br-xl'
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
									<div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg rounded-2xl w-10 h-10 text-white">
										<Bot className="w-5 h-5" />
									</div>
									<div className="bg-white shadow-lg px-5 py-3 border border-stone-200/50 rounded-3xl rounded-bl-xl">
										<div className="flex space-x-2">
											<div className="bg-blue-500 rounded-full w-2 h-2 animate-bounce"></div>
											<div className="bg-blue-500 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
											<div className="bg-blue-500 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
										</div>
									</div>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Input Area */}
					<div className="bg-gradient-to-r from-white via-stone-50/50 to-white backdrop-blur-sm p-6 border-stone-200/50 border-t">
						<div className="flex items-center space-x-4 w-full">
							{/* Voice Recording Button */}
							<button
								onClick={toggleRecording}
								className={`flex-shrink-0 p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg ${isRecording
									? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-200 animate-pulse'
									: 'bg-gradient-to-br from-stone-100 to-stone-200 text-stone-600 hover:from-stone-200 hover:to-stone-300 shadow-stone-200'
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
									className="bg-gradient-to-br from-white to-stone-50/50 shadow-inner p-4 border-2 border-stone-200/50 focus:border-blue-500/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full text-stone-800 text-sm transition-all duration-300 resize-none placeholder-stone-400"
									rows="1"
									style={{ minHeight: '50px', maxHeight: '120px' }}
								/>
							</div>

							{/* Send Button */}
							<button
								onClick={handleSendMessage}
								disabled={!inputMessage.trim()}
								className="flex-shrink-0 bg-gradient-to-br from-blue-500 hover:from-blue-600 disabled:from-stone-300 to-blue-600 hover:to-blue-700 disabled:to-stone-400 shadow-lg hover:shadow-blue-200 disabled:shadow-stone-200 p-3 rounded-2xl text-white hover:scale-105 disabled:hover:scale-100 transition-all duration-300 disabled:cursor-not-allowed transform"
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