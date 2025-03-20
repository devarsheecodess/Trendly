const express = require("express");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const oauth2Client = require("../../config/youtubeConfig"); // Correct import of your OAuth2 client

const router = express.Router();

// =================== AUTH FLOW ===================

// Auth Route to Generate URL
router.get("/auth", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.upload"],
  });

  console.log("✅ Auth URL generated:", authUrl);
  res.redirect(authUrl);
});

// OAuth2 Callback
router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save tokens for future use
    fs.writeFileSync(
      path.resolve(__dirname, "../../config/tokens.json"),
      JSON.stringify(tokens)
    );

    console.log("✅ Authentication successful! Tokens saved.");
    res.send("✅ Authentication successful! Tokens have been saved.");
  } catch (error) {
    console.error("❌ Authentication Error:", error.message);
    res.status(500).send("Authentication failed.");
  }
});

// =================== VIDEO UPLOAD FLOW ===================

async function uploadVideo(videoPath, title, description) {
  const absoluteVideoPath = path.resolve(videoPath);

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  const response = await youtube.videos.insert({
    part: "snippet,status",
    requestBody: {
      snippet: { title, description },
      status: { privacyStatus: "public" },
    },
    media: { body: fs.createReadStream(absoluteVideoPath) },
  });

  console.log("✅ Video uploaded:", response.data.id);
  return response.data.id;
}

// Upload Route
router.post("/upload", async (req, res) => {
  const { videoPath, title, description } = req.body;

  try {
    const videoId = await uploadVideo(videoPath, title, description);
    res.json({ message: "✅ Video uploaded successfully!", videoId });
  } catch (error) {
    console.error("❌ Upload Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/test", (req, res) => {
  res.send("✅ Test route is working!");
});

module.exports = router;
