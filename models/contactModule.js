const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    required: true,
  },
  contact_info: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("support", supportSchema);
