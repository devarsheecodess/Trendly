const express = require("express");
const cloudinary = require("../config/cloudinaryConfig.js");
const upload = require("../config/multerConfig.js");

const router = express.Router();

router.post("/store", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
});

module.exports = router;
