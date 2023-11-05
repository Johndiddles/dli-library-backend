const users = require("../models/userModule");

const getAllUsers = async (req, res) => {
  users.find().then((response) => {
    res.status(200).json(response);
  });
};

module.exports = getAllUsers;
