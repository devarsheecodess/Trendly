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
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      response: {
        type: "object",
        properties: {
          title: { type: "string" },
          introduction: {
            type: "object",
            properties: {
              text: { type: "string" },
            },
            required: ["text"],
          },
          content: {
            type: "array",
            items: {
              type: "object",
              properties: {
                heading: { type: "string" },
                details: { type: "string" },
                examples: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["heading", "details"],
            },
          },
          conclusion: {
            type: "object",
            properties: {
              text: { type: "string" },
            },
            required: ["text"],
          },
          call_to_action: {
            type: "object",
            properties: {
              text: { type: "string" },
            },
            required: ["text"],
          },
        },
        required: [
          "title",
          "introduction",
          "content",
          "conclusion",
          "call_to_action",
        ],
      },
    },
    required: ["response"],
  },
};

router.post("/generate", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(text);
    const response = result.response.text();
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
