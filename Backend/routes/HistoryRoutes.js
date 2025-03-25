const express = require("express");
const router = express.Router();

// Import models
const ScriptModel = require("../models/ScriptModel");
const SEOModel = require("../models/SEOModel");
const ThumbnailModel = require("../models/ThumbnailModel");
const VoiceoverModel = require("../models/VoiceoverModel");

router.get("/", (req, res) => {
  res.send("History Route");
});

// Add Script to History
router.post("/script", async (req, res) => {
  try {
    const script = new ScriptModel(req.body);
    await script.save();
    res.send({ success: true, message: "Script added to history" });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to add script to history" });
  }
});

// Add SEO to History
router.post("/seo", async (req, res) => {
  try {
    const seo = new SEOModel(req.body);
    await seo.save();
    res.send({ success: true, message: "SEO added to history" });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to add SEO to history" });
  }
});

// Add Thumbnail to History
router.post("/thumbnail", async (req, res) => {
  try {
    const thumbnail = new ThumbnailModel(req.body);
    await thumbnail.save();
    res.send({ success: true, message: "Thumbnail added to history" });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to add thumbnail to history" });
  }
});

// Add Voiceover to History
router.post("/voiceover", async (req, res) => {
  try {
    const voiceover = new VoiceoverModel(req.body);
    await voiceover.save();
    res.send({ success: true, message: "Voiceover added to history" });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to add voiceover to history" });
  }
});

// Get all scripts from history
router.get("/scripts", async (req, res) => {
  try {
    const scripts = await ScriptModel.find();
    res.send({ success: true, scripts });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to get scripts from history" });
  }
});

// Get all SEOs from history
router.get("/seos", async (req, res) => {
  try {
    const seos = await SEOModel.find();
    res.send({ success: true, seos });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to get SEOs from history" });
  }
});

// Get all thumbnails from history
router.get("/thumbnails", async (req, res) => {
  try {
    const thumbnails = await ThumbnailModel.find();
    res.send({ success: true, thumbnails });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to get thumbnails from history",
    });
  }
});

// Get all voiceovers from history
router.get("/voiceovers", async (req, res) => {
  try {
    const voiceovers = await VoiceoverModel.find();
    res.send({ success: true, voiceovers });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to get voiceovers from history",
    });
  }
});

module.exports = router;
