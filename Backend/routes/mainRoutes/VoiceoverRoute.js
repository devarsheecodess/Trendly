const express = require("express");
const { ElevenLabsClient } = require("elevenlabs");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const generateSpeech = async (voice_id, text, speed) => {
  try {
    const audioStream = await client.textToSpeech
      .convert(voice_id, {
        model_id: "eleven_multilingual_v2",
        text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          speed,
        },
      })
      .catch((err) => {
        console.error("Stream Error:", err);
        throw err;
      });

    const tempFilePath = path.join(__dirname, `temp_audio_${Date.now()}.mp3`);
    const writeStream = fs.createWriteStream(tempFilePath);

    audioStream.pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on("finish", async () => {
        try {
          const result = await cloudinary.uploader.upload(tempFilePath, {
            resource_type: "video",
          });

          fs.unlinkSync(tempFilePath); // Ensure cleanup
          resolve(result.secure_url);
        } catch (error) {
          fs.unlinkSync(tempFilePath); // Cleanup even if upload fails
          reject(error);
        }
      });

      writeStream.on("error", (err) => {
        fs.unlinkSync(tempFilePath); // Cleanup on error
        reject(err);
      });
    });
  } catch (error) {
    console.error(
      "Error generating speech:",
      error.response ? await error.response.text() : error
    );
    throw error;
  }
};

router.post("/generate", async (req, res) => {
  const { voice_id, text, speed } = req.body;

  if (!voice_id || !text) {
    console.log("Missing parameters");
    return res.status(400).json({
      success: false,
      message: "Please provide voice_id and text",
    });
  }

  try {
    const cloudinaryUrl = await generateSpeech(voice_id, text, speed);

    res.status(200).json({ success: true, url: cloudinaryUrl });
  } catch (error) {
    console.error("Failed to generate speech:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate speech" });
  }
});

// Download file from cloudinary using URL
router.get("/download", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a valid URL" });
  }

  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream",
    });

    const tempFilePath = path.join(
      __dirname,
      `downloaded_audio_${Date.now()}.mp3`
    );
    const writeStream = fs.createWriteStream(tempFilePath);

    response.data.pipe(writeStream);

    writeStream.on("finish", () => {
      res.download(tempFilePath, "voiceover.mp3", () => {
        fs.unlinkSync(tempFilePath); // Clean up after download
      });
    });

    writeStream.on("error", (error) => {
      console.error("Error writing file:", error);
      res.status(500).json({ success: false, message: "Error writing file" });
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to download file" });
  }
});

module.exports = router;
