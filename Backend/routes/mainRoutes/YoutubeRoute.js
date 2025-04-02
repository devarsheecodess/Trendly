const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { google } = require("googleapis");
const oauth2Client = require("../../config/youtubeConfig"); // Ensure correct path
const User = require("../../models/UserModel"); // User model for storing OAuth tokens

const router = express.Router();

// Generate OAuth2 Authentication URL
router.get("/auth", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.upload"],
  });

  console.log("✅ Auth URL:", authUrl);
  res.redirect(authUrl);
});

// OAuth2 Callback - Store tokens in MongoDB
router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save tokens in MongoDB
    await User.updateOne(
      { email: "user@example.com" }, // Replace with authenticated user
      { googleTokens: tokens },
      { upsert: true }
    );

    console.log("✅ Authentication successful! Tokens saved.");
    res.send("✅ Authentication successful! Tokens have been saved.");
  } catch (error) {
    console.error("❌ Authentication Error:", error.message);
    res.status(500).send("Authentication failed.");
  }
});

// Upload Video to YouTube
async function uploadVideo(
  videoPath,
  title,
  description,
  categoryId,
  privacyStatus,
  publishTime,
  thumbnailPath
) {
  try {
    // Check if videoPath is a Cloudinary URL or local path
    let mediaBody;
    if (videoPath.startsWith("http")) {
      console.log("🔄 Fetching remote video from Cloudinary...");
      const response = await axios.get(videoPath, { responseType: "stream" });
      mediaBody = { body: response.data };
    } else {
      mediaBody = { body: fs.createReadStream(path.resolve(videoPath)) };
    }

    if (publishTime) {
      console.warn(
        "⚠️ Scheduling detected; setting privacyStatus to 'private'."
      );
      privacyStatus = "private";
    }

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    // Upload Video
    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: { title, description, categoryId: categoryId || "22" },
        status: {
          privacyStatus: privacyStatus || "public",
          publishAt: publishTime || null,
        },
      },
      media: mediaBody,
    });

    const videoId = response.data.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    console.log("✅ Video uploaded:", videoUrl);

    // Set Thumbnail if provided
    if (thumbnailPath) {
      await setThumbnail(videoId, thumbnailPath);
    }

    return { videoId, videoUrl };
  } catch (error) {
    console.error("❌ Upload Error:", error.response?.data || error.message);
    throw new Error("Failed to upload video. Check logs for details.");
  }
}

// Upload Thumbnail (Supports Local and Cloudinary URLs)
async function setThumbnail(videoId, thumbnailPath) {
  try {
    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    let mediaBody;

    if (thumbnailPath.startsWith("http")) {
      console.log("🔄 Fetching remote thumbnail...");
      const response = await axios.get(thumbnailPath, {
        responseType: "stream",
      });
      mediaBody = { body: response.data };
    } else {
      mediaBody = { body: fs.createReadStream(path.resolve(thumbnailPath)) };
    }

    const response = await youtube.thumbnails.set({
      videoId,
      media: mediaBody,
    });
    console.log("✅ Thumbnail uploaded:", response.data);
  } catch (error) {
    console.error(
      "❌ Thumbnail Upload Error:",
      error.response?.data || error.message
    );
  }
}

// Handle Video Upload API
router.post("/upload", async (req, res) => {
  const {
    videoPath,
    title,
    description,
    categoryId,
    privacyStatus,
    publishTime,
    thumbnailPath,
  } = req.body;

  try {
    const { videoId, videoUrl } = await uploadVideo(
      videoPath,
      title,
      description,
      categoryId,
      privacyStatus,
      publishTime,
      thumbnailPath
    );
    res.json({
      success: true,
      message: "✅ Video uploaded successfully!",
      videoId,
      videoUrl,
    });
  } catch (error) {
    console.error("❌ Upload Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// Test Route
router.get("/test", (req, res) => {
  res.send("✅ YouTube API Test Route is Working!");
});

module.exports = router;
