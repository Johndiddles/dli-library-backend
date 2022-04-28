const mongoose = require("mongoose");

const storeModuleTemplate = mongoose.Schema({
  id: {
    type: "String",
    required: true,
  },
  url: {
    type: "Object",
    required: true,
  },
});

module.exports = mongoose.model("files", storeModuleTemplate);
