const mongoose = require("mongoose");

const SEOSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    titleScore: {
      type: Number,
      required: true,
    },
    optimizedTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    hashtags: {
      type: Object,
      default: {},
    },
    tags: {
      type: Object,
      default: {},
    },
    strengthPoints: {
      type: Object,
      default: {},
    },
    opportunityPoints: {
      type: Object,
      default: {},
    },
    weaknessPoints: {
      type: Object,
      default: {},
    },
    primaryKeywords: {
      type: Object,
      default: {},
    },
    longTailKeywords: {
      type: Object,
      default: {},
    },
    optimalVideoLength: {
      type: String,
      required: true,
    },
    bestPublishingTime: {
      type: String,
      required: true,
    },
    thumbnailStyle: {
      type: String,
      required: true,
    },
    engagementHooks: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SEOModel = mongoose.model("SEOs", SEOSchema);
module.exports = SEOModel;
