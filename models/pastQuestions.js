const mongoose = require("mongoose");

const PastQuestionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    courseTitle: {
      type: String,
      required: true,
    },
    departments: {
      type: [String],
      required: true,
    },
    session: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    likes: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("pastQuestion", PastQuestionSchema);
