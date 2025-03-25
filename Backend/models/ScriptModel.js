const mongoose = require("mongoose");

const ScriptSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    call_to_action: {
      type: Object,
      required: true,
    },
    conclusion: {
      type: Object,
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
    introduction: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ScriptModel = mongoose.model("Scripts", ScriptSchema);
module.exports = ScriptModel;
