const mongoose = require("mongoose");

const moduleTemplate = new mongoose.Schema({
  id: {
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
  level: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  thumbnail: {
    type: "Object",
    required: true,
  },
});

module.exports = mongoose.model("modules", moduleTemplate);
