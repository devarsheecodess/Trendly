const mongoose = require("mongoose");

const VoiceoverSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    voiceover: {
      type: String,
      required: true,
    },
    voice: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const VoiceoverModel = mongoose.model("Voiceovers", VoiceoverSchema);
module.exports = VoiceoverModel;
