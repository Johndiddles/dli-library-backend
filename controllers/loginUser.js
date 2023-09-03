const users = require("../models/userModule");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginUser = async (req, res) => {
  users
    .findOne({
      $or: [{ email: req.body.username }, { phone: req.body.username }],
    })
    .then((user) => {
      if (!user) {
        res.status(400).json({
          data: {
            status: "failed",
            message: "user does not exist",
          },
        });
      } else {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            res.status(500).json({
              data: {
                status: "failed",
                message: "an error occured",
                error: err,
              },
            });
          } else if (result) {
            let token = jwt.sign(
              { email: user.email },
              process.env.JWT_AUTH_SECRET_KEY,
              {
                expiresIn: 60 * 60 * 5,
              }
            );
            res.status(201).json({
              data: {
                status: "success",
                message: "Login Successful",
                token,
                user: {
                  full_name: `${user.first_name} ${user.last_name}`,
                  email: user.email,
                  favorite_modules: user.favorite_modules,
                  role: user.role === process.env.ADMIN_KEY ? "admin" : "user",
                },
              },
            });
          } else {
            res.status(403).json({
              data: {
                status: "failed",
                message: "Incorrect password",
              },
            });
          }
        });
      }
    });
};

module.exports = loginUser;
