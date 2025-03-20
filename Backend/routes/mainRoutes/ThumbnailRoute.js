const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const path = require("path");
const fs = require("fs").promises;

const cloudinaryConfig = require("../../config/cloudinaryConfig");
cloudinary.config(cloudinaryConfig);

router.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  console.log("Prompt:", prompt);

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const API_KEY = process.env.STABILITY_API_KEY;
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("output_format", "jpeg");

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/sd3",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${API_KEY}`,
          Accept: "image/*",
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/jpeg;base64,${Buffer.from(
      response.data
    ).toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "generated_images",
    });

    console.log("Image URL:", uploadResult.secure_url);

    res.json({ imageUrl: uploadResult.secure_url });
  } catch (error) {
    console.error(
      "Error generating image:",
      error.response?.data.toString() || error.message
    );
    res.status(500).json({ error: "Failed to generate image" });
  }
});

router.get("/download", async (req, res) => {
  const { imageUrl } = req.query;
  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  const decodedImageUrl = decodeURIComponent(imageUrl);
  console.log("Request received for image download:", decodedImageUrl);

  try {
    const response = await axios.get(decodedImageUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
    });

    const fileName = `downloaded_image_${Date.now()}.jpeg`;
    const downloadsPath = path.join(__dirname, "..", "downloads");

    await fs.mkdir(downloadsPath, { recursive: true });

    const filePath = path.resolve(downloadsPath, fileName);
    await fs.writeFile(filePath, response.data);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ error: "Failed to download image" });
      } else {
        fs.unlink(filePath).catch(console.error); // Avoid crash on unlink failure
      }
    });
  } catch (error) {
    console.error("Error downloading image:", error.message);
    res.status(500).json({ error: "Failed to download image" });
  }
});

module.exports = router;
