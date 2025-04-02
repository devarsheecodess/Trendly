const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { google } = require("googleapis");
const oauth2Client = require("../../config/youtubeConfig"); // Ensure correct path

const router = express.Router();
const TOKEN_PATH = path.resolve(__dirname, "../../config/tokens.json");

// ✅ Generate OAuth2 Authentication URL
router.get("/auth", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.upload"],
    prompt: "consent", // Ensure we always get a refresh token
  });

  console.log("✅ Auth URL:", authUrl);
  res.redirect(authUrl);
});

// ✅ OAuth2 Callback - Store tokens in JSON file
router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);

    // Load existing tokens if available
    let savedTokens = {};
    if (fs.existsSync(TOKEN_PATH)) {
      savedTokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
    }

    // Preserve old refresh token if not provided
    if (!tokens.refresh_token && savedTokens.refresh_token) {
      tokens.refresh_token = savedTokens.refresh_token;
    }

    // Save tokens
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    oauth2Client.setCredentials(tokens);

    console.log("✅ Authentication successful! Tokens saved.");

    // ✅ Auto-close the popup and notify the main window
    res.send(`
      <script>
          window.opener.postMessage("AUTH_SUCCESS", "*");
          window.close();
      </script>
    `);
  } catch (error) {
    console.error("❌ Authentication Error:", error.message);
    res.status(500).send("Authentication failed.");
  }
});

// ✅ Load stored tokens before uploading videos
async function loadTokens() {
  if (fs.existsSync(TOKEN_PATH)) {
    const savedTokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
    oauth2Client.setCredentials(savedTokens);
  } else {
    throw new Error("No refresh token is set. Please authenticate again.");
  }
}

// ✅ Upload Video to YouTube
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
    await loadTokens(); // Ensure tokens are set

    let mediaBody;
    if (videoPath.startsWith("http")) {
      console.log("🔄 Fetching remote video from URL...");
      const response = await axios.get(videoPath, { responseType: "stream" });
      mediaBody = { body: response.data };
    } else {
      const absoluteVideoPath = path.resolve(videoPath);
      if (
        !fs.existsSync(absoluteVideoPath) ||
        fs.lstatSync(absoluteVideoPath).isDirectory()
      ) {
        throw new Error(`Invalid file path: ${absoluteVideoPath}`);
      }
      mediaBody = { body: fs.createReadStream(absoluteVideoPath) };
    }

    if (publishTime) {
      console.warn(
        "⚠️ Scheduling detected; setting privacyStatus to 'private'."
      );
      privacyStatus = "private";
    }

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

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

    if (thumbnailPath) {
      await setThumbnail(videoId, thumbnailPath);
    }

    return { videoId, videoUrl };
  } catch (error) {
    console.error("❌ Upload Error:", error.response?.data || error.message);
    throw new Error("Failed to upload video. Check logs for details.");
  }
}

// ✅ Upload Thumbnail
async function setThumbnail(videoId, thumbnailPath) {
  try {
    await loadTokens();

    let mediaBody;
    if (thumbnailPath.startsWith("http")) {
      console.log("🔄 Fetching remote thumbnail...");
      const response = await axios.get(thumbnailPath, {
        responseType: "stream",
      });
      mediaBody = { body: response.data };
    } else {
      const absoluteThumbnailPath = path.resolve(thumbnailPath);
      if (
        !fs.existsSync(absoluteThumbnailPath) ||
        fs.lstatSync(absoluteThumbnailPath).isDirectory()
      ) {
        throw new Error(`Invalid file path: ${absoluteThumbnailPath}`);
      }
      mediaBody = { body: fs.createReadStream(absoluteThumbnailPath) };
    }

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

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

// ✅ Handle Video Upload API
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

router.post("/save", async (req, res) => {
  try {
    console.log("🔍 Data to save:", req.body);

    // ✅ Create new video document
    const video = new YoutubeModel(req.body);
    await video.save();

    res.json({ success: true, message: "✅ Video data saved to database" });
  } catch (err) {
    console.error("❌ Error saving video data:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Test Route
router.get("/test", (req, res) => {
  res.send("✅ YouTube API Test Route is Working!");
});

module.exports = router;
