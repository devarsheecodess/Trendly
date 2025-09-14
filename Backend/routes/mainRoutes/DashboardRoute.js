const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { resolveUserId } = require("../authHelpers");
const { requireAuth } = require("../../middleware/auth");

// Import models
const Voiceover = require("../../models/VoiceoverModel");
const Thumbnail = require("../../models/ThumbnailModel");
const Script = require("../../models/ScriptModel");
const SEO = require("../../models/SEOModel");
const YTVideo = require("../../models/YoutubeModel");

router.get("/", (req, res) => {
	res.status(200).json({
		message: "Welcome to the Dashboard",
	});
});

router.get("/stats", requireAuth, async (req, res) => {
	const id = req.userId || (await resolveUserId(req));
	console.log("📌 Received User ID:", id);

	if (!id) {
		return res.status(400).json({ success: false, message: "User ID is required" });
	}

	try {
		// Convert ID if it's an ObjectId
		const userIdQuery = mongoose.Types.ObjectId.isValid(id)
			? new mongoose.Types.ObjectId(id)
			: id;

		const [voiceovers, thumbnails, scripts, SEOs, YTvideos] = await Promise.all(
			[
				Voiceover.find({ userId: userIdQuery }).exec(),
				Thumbnail.find({ userId: userIdQuery }).exec(),
				Script.find({ userId: userIdQuery }).exec(),
				SEO.find({ userId: userIdQuery }).exec(),
				YTVideo.find({ userId: userIdQuery }).exec(),
			]
		);

		console.log("📌 Found Voiceovers:", voiceovers.length);
		console.log("📌 Found Thumbnails:", thumbnails.length);
		console.log("📌 Found Scripts:", scripts.length);
		console.log("📌 Found SEOs:", SEOs.length);
		console.log("📌 Found YouTube Videos:", YTvideos.length);

		const recentProjects = YTvideos.map((video) => ({
			title: video.title,
			thumbnail: video.thumbnail,
			privacy: video.privacy,
			date: new Date(video.createdAt).toLocaleString("en-US", {
				day: "numeric",
				month: "long",
				year: "numeric",
			}),
		}));

		console.log("📌 Recent Projects:", recentProjects);

		res.status(200).json({
			success: true,
			data: {
				voiceoverStats: voiceovers.length,
				thumbnailStats: thumbnails.length,
				scriptStats: scripts.length,
				SEOStats: SEOs.length,
				videoStats: YTvideos.length,
				recentProjects,
			},
		});
	} catch (err) {
		console.error("❌ Error fetching stats:", err);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

module.exports = router;
