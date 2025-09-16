const mongoose = require("mongoose");

// Message sub-schema
const messageSchema = new mongoose.Schema(
	{
		role: {
			type: String,
			required: true,
			enum: ["user", "agent"], // Define roles explicitly
		},
		type: {
			type: String,
			required: true,
			enum: ["message", "action"], // Keep it consistent
		},
		content: {
			type: String,
			required: true,
		},
		timestamp: {
			type: Date,
			default: Date.now,
		},
		metadata: {
			type: Object,
			default: {}, // Optional field for storing extra info (e.g., LLM info, step info)
		},
	},
	{ _id: false }
);

// Chat history schema
const ChatHistorySchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User", // Optional reference to Users collection
		},
		sessionName: {
			type: String,
			required: true,
			default: "Untitled Chat", // Human-readable session name
		},
		description: {
			type: String,
			default: "",
		},
		messages: {
			type: [messageSchema], // Embed messages
			default: [],
		},
	},
	{ timestamps: true }
);

const ChatHistoryModel = mongoose.model("ChatHistory", ChatHistorySchema);
module.exports = ChatHistoryModel;