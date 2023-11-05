const users = require("../models/userModule");
const support = require("../models/contactModule");

const getContactMessage = async (req, res) => {
  support.find().then((response) => {
    res.status(200).json(response);
  });
};

module.exports = getContactMessage;
