const express = require("express");
const cloudinary = require("../config/cloudinaryConfig.js");
const upload = require("../config/multerConfig.js");

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
