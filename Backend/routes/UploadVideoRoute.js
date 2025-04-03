const express = require("express");
const upload = require("../config/multerConfig.js");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

// Video Upload Route
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video", // Important: Specifies video upload
    });

    res.json({
      message: "✅ Video uploaded successfully!",
      videoUrl: result.secure_url,
    });
  } catch (error) {
    console.error("❌ Video Upload Error:", error.message);
    res.status(500).json({ error: "Failed to upload video" });
  }
});

module.exports = router;
