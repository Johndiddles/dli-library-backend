const { randomUUID } = require("crypto");
const jwt = require("jsonwebtoken");
const users = require("../models/userModule");
const bcrypt = require("bcrypt");

const createUserController = async (req, res) => {
  const id = randomUUID();
  const email = req.body.email;
  const phone = req.body.phone;

  users.findOne({ $or: [{ email }, { phone }] }).then((user) => {
    if (phone && phone !== "" && user?.phone === phone) {
      res.status(400).json({ message: "phone already exist" });
    } else if (user?.email === email) {
      res.status(400).json({ message: "email already exist" });
    } else {
      bcrypt.hash(req.body.password, 10, function (err, hashedPwd) {
        if (err) {
          res.status(500).json({
            message: "Unexpected error",
          });
        }

        const user = new users({
          id: id,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: email?.toLowerCase(),
          phone: phone,
          password: hashedPwd,
          role: "user",
          createdAt: new Date(),
          favorite_modules: [],
        });

        user
          .save()
          .then((data) => {
            let token = jwt.sign(
              { email: data.email },
              process.env.JWT_AUTH_SECRET_KEY,
              {
                expiresIn: 60 * 60,
              }
            );
            res.status(200).json({
              data: {
                status: "success",
                message: "user created successfully",
                token,
                user: {
                  full_name: `${data.first_name} ${data.last_name}`,
                  email: data.email,
                  favorite_modules: [],
                },
              },
            });
          })
          .catch((error) => {
            // console.log("error: ", error.errors);
            res.status(500).json({
              message: "Unexpected Error",
              error: error.errors,
            });
          });
      });
    }
  });
};

module.exports = createUserController;
