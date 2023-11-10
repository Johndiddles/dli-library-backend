const users = require("../models/userModule");

const verifyUser = async (req, res) => {
  users.findOne({ email: req.user.email }).then((user) => {
    res.status(200).json({
      message: "successfully verified user",
      user: {
        name: user.name,
        email: user.email,
        favorite_modules: user.favorite_modules,
        role: user.role === process.env.ADMIN_KEY ? "admin" : "user",
      },
    });
  });
};

module.exports = verifyUser;
