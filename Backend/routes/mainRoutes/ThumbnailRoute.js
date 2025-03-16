const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config(); // Load environment variables

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

router.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        topP: 1,
        topK: 40,
        maxOutputTokens: 1024,
        responseMimeType: "image/png",
      },
    });

    console.log("Full Response:", JSON.stringify(result, null, 2));

    const imageData =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.base64;

    if (!imageData) {
      return res.status(500).json({
        error: "Failed to generate image. Check prompt or try again later.",
      });
    }

    const base64Image = `data:image/png;base64,${imageData}`;
    res.json({ image: base64Image });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Failed to generate image. Possible quota issue or prompt error.",
    });
  }
});

router.get("/health", (req, res) => {
  res.json({
    message: "API is running",
    apiKeyLoaded: !!apiKey,
    modelLoaded: !!model,
  });
});

module.exports = router;
