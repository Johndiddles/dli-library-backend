const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("departments", departmentSchema);
