const mongoose = require("mongoose");

const OnboardingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String, // URL or Cloudinary link
      default: "",
    },
    channelName: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      default: "",
    },
    subscribers: {
      type: String,
      enum: [
        "0-1000",
        "1000-10000",
        "10000-100000",
        "100000-1000000",
        "1000000+",
      ],
      required: true,
    },
    contentType: {
      type: String,
      enum: ["long-form", "shorts", "mixed", "livestream"],
      required: true,
    },
    contentNiche: {
      type: Array,
      default: [],
    },
    ageGroups: {
      type: Array,
      default: [],
    },
    audienceInterests: {
      type: Array,
      default: [],
    },
    audienceDetails: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Onboarding", OnboardingSchema);
