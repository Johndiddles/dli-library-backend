const { response } = require("express");
const { randomUUID } = require("crypto");
const express = require("express");
const router = express.Router();
const moduleTemplateCopy = require("./models/createModule");
const storeModuleTemplateCopy = require("./models/storeModule");
const users = require("./models/userModule");

const authenticate = require("./middlewares/authentication");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// fetch all modules
router.get("/modules", (req, res) => {
  moduleTemplateCopy
    .find()
    .then((response) => {
      console.log(response);
      res.status(201).json(response);
    })
    .catch((error) => console.log(error));
});

//fetch single module
router.get("/modules/:id", (req, res) => {
  storeModuleTemplateCopy
    .find({ id: req.params.id })
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => console.log(error));
});

// add a single module
router.post("/modules/add", authenticate, (req, res) => {
  users.findOne({ email: req.user.email }).then((user) => {
    if (!user || user?.role !== process.env.ADMIN_KEY) {
      res.status(403).json({
        data: {
          status: "failed",
          message: "access denied",
        },
      });
    } else {
      const id = randomUUID();
      const uploadFile = new storeModuleTemplateCopy({
        id: id,
        url: req.body.url,
      });
      const uploadModule = new moduleTemplateCopy({
        id: id,
        courseCode: req.body.courseCode,
        courseTitle: req.body.courseTitle,
        level: req.body.level,
        department: req.body.department,
        // url: req.body.url,
      });

      uploadFile
        .save()
        .then((data) => {
          console.log("fileUpload: ", data);
          uploadModule
            .save()
            .then((data) => {
              res.status(201).json({
                data: {
                  status: "success",
                  message: "module uploaded successfully",
                  data: data,
                },
              });
            })
            .catch((error) => {
              res.json(error);
            });
        })
        .catch((error) => console.log(error));
    }
  });
});

router.post("/user/create", (req, res) => {
  const id = randomUUID();
  const email = req.body.email;
  const phone = req.body.phone;

  // console.log(users.findOne({ email: email }));

  users.findOne({ $or: [{ email: email }, { phone: phone }] }).then((user) => {
    if (user?.phone === phone) {
      res.status(400).json({ message: "phone already exist" });
    } else if (user?.email === email) {
      res.status(400).json({ message: "email already exist" });
    } else {
      bcrypt.hash(req.body.password, 10, function (err, hashedPwd) {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "Unexpected error",
          });
        }

        const user = new users({
          id: id,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: email,
          phone: phone,
          password: hashedPwd,
          role: "user",
          createdAt: new Date(),
        });

        user
          .save()
          .then((data) => {
            res.status(200).json({
              data: {
                status: "success",
                message: "user created successfully",
                data: {
                  first_name: data.first_name,
                  last_name: data.last_name,
                  email: data.email,
                  phone: data.phone,
                },
              },
            });
          })
          .catch((error) => {
            console.log("error: ", error.errors);
            res.status(500).json({
              message: "Unexpected Error",
              error: error.errors,
            });
          });
      });
    }
  });
});

router.post("/user/login", (req, res) => [
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
                expiresIn: 60 * 60,
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
    }),
]);

router.post("/user/verify", authenticate, (req, res) => {
  users.findOne({ email: req.user.email }).then((user) => {
    console.log(user.favorite_modules);
    res.status(201).json({
      message: "successfully verified user",
      user: {
        full_name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        favorite_modules: user.favorite_modules,
      },
    });
  });
});

module.exports = router;
