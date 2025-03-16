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

router.post("/analyze", async (req, res) => {
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
    let responseText = result.response.text();

    // Clean up the response - remove markdown code blocks
    responseText = responseText.replace(/```json\n|\n```/g, "");

    // Instead of trying to parse the JSON, just return the text
    // This avoids JSON parsing errors when the response isn't valid JSON
    res.json({ response: responseText });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

module.exports = router;
