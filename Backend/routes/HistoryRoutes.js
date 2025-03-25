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

module.exports = router;
