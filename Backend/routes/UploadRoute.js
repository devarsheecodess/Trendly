import express from "express";
import cloudinary from "../cloudinaryConfig.js";
import upload from "../multerConfig.js";

const router = express.Router();

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
});

export default router;
