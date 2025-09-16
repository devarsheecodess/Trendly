const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/chat", (req, res) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Authorization header missing or malformed" });
	}
	const token = authHeader.split(" ")[1];
	const secret = process.env.JWT_SECRET;
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