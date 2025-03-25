const mongoose = require("mongoose");

const ThumbnailSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ThumbnailModel = mongoose.model("Thumbnails", ThumbnailSchema);
module.exports = ThumbnailModel;
