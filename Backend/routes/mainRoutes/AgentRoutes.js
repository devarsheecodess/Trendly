const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const ChatHistoryModel = require("../../models/ChatHistoryModel");
const secret = process.env.JWT_SECRET;

router.post('/create', (req, res) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Authorization header missing or malformed" });
	}
	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, secret);
		req.user = decoded;
	} catch (err) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
	const { sessionName, description, messages } = req.body;
	const userId = req.user.id;
	const newChatHistory = new ChatHistoryModel({
		userId,
		sessionName,
		description,
		messages
	});
	newChatHistory.save()
		.then(() => res.status(201).json({ message: "Chat history created successfully" }))
		.catch(err => res.status(500).json({ error: "Failed to create chat history" }));
});

router.get('/list', async (req, res) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Authorization header missing or malformed" });
	}
	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, secret);
		req.user = decoded;
	} catch (err) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
	const chats = await ChatHistoryModel.find({ userId: req.user.id })
	const chatList = chats.map(chat => ({
		id: chat._id,
		sessionName: chat.sessionName,
		description: chat.description,
		createdAt: chat.createdAt
	}));
	res.json(chatList);
});

router.get("/chat", (req, res) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Authorization header missing or malformed" });
	}
	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, secret);
		req.user = decoded;
	} catch (err) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
	const prompt = req.query.prompt;
	if (!prompt) {
		return res.status(400).json({ error: "Prompt is required" });
	}
	res.json({ response: `You said: ${prompt}` });
});

module.exports = router;