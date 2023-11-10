const users = require("../models/userModule");
const { randomUUID } = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authProviders = ["oauth-google", "credentials"];
const token_expiration = 60 * 60 * 5;
const loginUser = async (req, res) => {
  const userData = req.body;

  if (!authProviders.includes(userData.authenticated_via)) {
    return res.status(403).json({ message: "Invalid credentials" });
  }

  if (
    !userData.name ||
    !userData?.email ||
    (!userData.password && userData.authenticated_via === "credentials")
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await users
    .findOne({ email: userData.email?.toLowerCase() })
    .lean()
    .exec();

  if (duplicate) {
    if (
      duplicate.authenticated_via === userData?.authenticated_via &&
      userData.authenticated_via === "credentials"
    ) {
      bcrypt.compare(req.body.password, userData.password, (err, result) => {
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
            { email: userData.email },
            process.env.JWT_AUTH_SECRET_KEY,
            {
              expiresIn: userData.exp || token_expiration,
            }
          );
          res.status(201).json({
            data: {
              status: "success",
              message: "Login Successful",
              token,
              user: {
                name: `${duplicate.first_name} ${duplicate.last_name}`,
                email: duplicate.email,
                role:
                  duplicate.role === process.env.ADMIN_KEY ? "admin" : "user",
              },
            },
          });
        } else {
          res.status(403).json({
            data: {
              status: "failed",
              message: "Invalid credentials",
            },
          });
        }
      });
    } else {
      let token = jwt.sign(
        { email: duplicate.email },
        process.env.JWT_AUTH_SECRET_KEY,
        {
          expiresIn: userData.exp || token_expiration,
        }
      );

      return res.status(200).json({
        message: "success",
        user: {
          name: duplicate.name,
          email: duplicate.email,
          role:
            duplicate.role === process.env.ADMIN_KEY ? "admin" : duplicate.role,
          token,
        },
      });
    }
  }

  const hashedPassword =
    userData.authenticated_via === "credentials"
      ? await bcrypt.hash(userData.password, 10)
      : "";
  userData.role = "user";
  userData.favorite_modules = [];

  const id = randomUUID();

  await users.create({
    id,
    name: userData.name,
    email: userData?.email?.toLowerCase(),
    password: hashedPassword,
    role: "user",
    favorite_modules: [],
    authenticated_via: userData?.authenticated_via,
  });
  let token = jwt.sign(
    { email: userData.email },
    process.env.JWT_AUTH_SECRET_KEY,
    {
      expiresIn: userData.exp || token_expiration,
    }
  );

  return res.status(201).json({
    message: "User Created",
    user: {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      token,
    },
  });

  // users
  //   .findOne({
  //     $or: [{ email: req.body.username }, { phone: req.body.username }],
  //   })
  //   .then((user) => {
  //     if (!user) {
  //       res.status(400).json({
  //         data: {
  //           status: "failed",
  //           message: "user does not exist",
  //         },
  //       });
  //     } else {
  //       bcrypt.compare(req.body.password, userData.password, (err, result) => {
  //         if (err) {
  //           res.status(500).json({
  //             data: {
  //               status: "failed",
  //               message: "an error occured",
  //               error: err,
  //             },
  //           });
  //         } else if (result) {
  //           let token = jwt.sign(
  //             { email: userData.email },
  //             process.env.JWT_AUTH_SECRET_KEY,
  //             {
  //               expiresIn: token_expiration,
  //             }
  //           );
  //           res.status(201).json({
  //             data: {
  //               status: "success",
  //               message: "Login Successful",
  //               token,
  //               user: {
  //                 full_name: `${userData.first_name} ${userData.last_name}`,
  //                 email: userData.email,
  //                 favorite_modules: userData.favorite_modules,
  //                 role: userData.role === process.env.ADMIN_KEY ? "admin" : "user",
  //               },
  //             },
  //           });
  //         } else {
  //           res.status(403).json({
  //             data: {
  //               status: "failed",
  //               message: "Incorrect password",
  //             },
  //           });
  //         }
  //       });
  //     }
  //   });
};

module.exports = loginUser;
