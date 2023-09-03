const users = require("../models/userModule");

const getAllUsers = async (req, res) => {
  users.findOne({ email: req.user.email }).then(async (user) => {
    if (!user || user?.role !== process.env.ADMIN_KEY) {
      res.status(403).json({
        data: {
          status: "failed",
          message: "access denied",
        },
      });
    } else {
      users.find().then((response) => {
        res.status(200).json(response);
      });
    }
  });
};

module.exports = getAllUsers;
