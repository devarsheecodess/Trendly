const express = require("express");
const router = express.Router();
const {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
});

const generationConfig = {
	temperature: 2,
	topP: 0.95,
	topK: 40,
	maxOutputTokens: 2000,
	responseMimeType: "text/plain",
};

const OnboardingModel = require("../../models/OnbordingModel");
const UserModel = require("../../models/UserModel");
const { resolveUserId } = require("../authHelpers");

router.post("/generate", async (req, res) => {
	const { prompt } = req.body;

	if (!prompt) {
		return res.status(400).json({ error: "Prompt is required." });
	}

	try {
		const chatSession = model.startChat({
			generationConfig,
			history: [],
		});

		const result = await chatSession.sendMessage(prompt);
		res.json({ response: result.response.text() });
	} catch (error) {
		console.error("Error generating response:", error);
		res.status(500).json({ error: "Failed to generate response." });
	}
});

router.get("/trending_topics", async (req, res) => {
	const id = await resolveUserId(req);
	try {
		const chatSession = model.startChat({
			generationConfig,
			history: [],
		});

		let onboardingData = null;
		let userData = null;
		if (id) {
			onboardingData = await OnboardingModel.findOne({ userId: id });
			userData = await UserModel.findById(id);
		}

		const data = {
			about: (onboardingData && onboardingData.about) || "",
			subscribers: (onboardingData && onboardingData.subscribers) || "",
			contentType: (onboardingData && onboardingData.contentType) || "",
			contentNiche: (onboardingData && onboardingData.contentNiche) || "",
			ageGroups: (onboardingData && onboardingData.ageGroups) || "",
			audienceInterests: (onboardingData && onboardingData.audienceInterests) || "",
			audienceDetails: (onboardingData && onboardingData.audienceDetails) || "",
			country: (userData && userData.country) || "",
		};

		const year = new Date().getFullYear();

		const prompt = `
     I am a youtuber. Generate 5 trending topics of year ${year} for my channel and give me responses in JSON format:
     {
     "topic": the topic name, 
     "popularity": the popularity of the topic(0 to 100%),
     }

     consider my following details:
      1. About: ${data.about}
      2. Subscribers: ${data.subscribers}
      3. My Content Type: ${data.contentType}
      4. My Content Niche: ${data.contentNiche}
      5. Age Groups that watch me: ${data.ageGroups}
      6. My audience interests: ${data.audienceInterests}
      7. Other Audience Details: ${data.audienceDetails}
      8. I live in Country: ${data.country} (country code)
    `;

		const result = await chatSession.sendMessage(prompt);
		res.json({ response: result.response.text() });
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
