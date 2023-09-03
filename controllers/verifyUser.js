const users = require("../models/userModule");

const verifyUser = async (req, res) => {
  users.findOne({ email: req.user.email }).then((user) => {
    res.status(200).json({
      message: "successfully verified user",
      user: {
        full_name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        favorite_modules: user.favorite_modules,
      },
    });
  });
};

module.exports = verifyUser;
