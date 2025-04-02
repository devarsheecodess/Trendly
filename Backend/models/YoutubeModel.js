const mongoose = require("mongoose");
const { Schema } = mongoose;

const YoutubeSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    privacy: {
      type: String,
      required: true,
    },
    publishTime: {
      type: String,
    },
  },
  { timestamps: true }
);

const YoutubeModel = mongoose.model("YoutubeVideos", YoutubeSchema);
module.exports = YoutubeModel;
