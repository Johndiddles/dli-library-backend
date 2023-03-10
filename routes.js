const { randomUUID } = require("crypto");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const moduleTemplateCopy = require("./models/createModule");
const users = require("./models/userModule");
const fs = require("fs");
const fileupload = require("express-fileupload");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");

const authenticate = require("./middlewares/authentication");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PDFNet } = require("@pdftron/pdfnet-node");
const path = require("path");

let gfs, gridfsBucket;

const connectToDB = async () => {
  const connectDB = async () => {
    const conn = mongoose.createConnection(process.env.DATABASE_ACCESS);

    conn.once("open", () => {
      gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "modules",
      });

      gfs = Grid(conn.db, mongoose.mongo);
      gfs.collection("modules");
    });
  };

  await connectDB();
};

connectToDB();

bodyParser.json();

router.use(methodOverride("_method"));

//** fetch all modules */
router.get("/modules", (req, res) => {
  moduleTemplateCopy
    .find()
    .then((response) => {
      res
        .status(201)
        .json(response?.sort((a, b) => Number(b?.date) - Number(a?.date)));
    })
    .catch((error) => console.log(error));
});

router.get("/get-single-module/:id", (req, res) => {
  moduleTemplateCopy
    .findOne({ id: req.params?.id })
    .then((response) => {
      // console.log(response);
      res.status(200).json(response);
    })
    .catch((error) => console.log(error));
});

router.get("/get-recent-modules", (req, res) => {
  moduleTemplateCopy.find().then((response) => {
    res
      .status(201)
      .json(
        response?.sort((a, b) => Number(b?.date) - Number(a?.date))?.slice(0, 3)
      );
  });
  // .catch((error) => console.log(error));
});

//**  add a single module *//
const storage = new GridFsStorage({
  url: process.env.DATABASE_ACCESS,
  file: (req, file) => {
    // console.log({ file });
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const id = buf.toString("hex");
        const filename = `module-${id}${path.extname(file.originalname)}`;
        const fileInfo = {
          id,
          filename: filename,
          bucketName: "modules",
        };

        // console.log({ fileInfo });
        resolve(fileInfo);
      });
    });
  },
});
//initialize upload with multer
const upload = multer({ storage });

router.post(
  "/modules/createThumbnail",
  authenticate,
  fileupload({ createParentPath: true }),
  (req, res) => {
    // console.log(req.files);
    users.findOne({ email: req.user.email }).then(async (user) => {
      if (!user || user?.role !== process.env.ADMIN_KEY) {
        res.status(403).json({
          data: {
            status: "failed",
            message: "access denied",
          },
        });
      } else {
        // let inputFile = req.files.module?.data;
        let inputFile = req.files?.module?.data;

        let outputFilePath = path.resolve(
          __dirname,
          `./files/${req.body?.courseCode}.png`
        );

        const getThumbnail = async () => {
          const doc = await PDFNet.PDFDoc.createFromBuffer(inputFile);
          await doc.initSecurityHandler();
          const pdfDraw = await PDFNet.PDFDraw.create(92);
          const currPage = await doc.getPage(1);
          await pdfDraw.export(currPage, outputFilePath, "PNG");

          //   return outputFile;
        };

        let fileThumbnail;

        await PDFNet.runWithCleanup(getThumbnail)
          .then(() => {
            fs.readFile(outputFilePath, (err, data) => {
              if (err) {
                res.status(500).json({
                  message: "an error occured while generating thumbnail",
                  error: err,
                });
              } else {
                fileThumbnail = data;
                res.setHeader("ContentType", "image/png").status(201).json({
                  message: "successfully generated thumbnail",
                  data: data,
                });

                fs.unlink(outputFilePath, () => {
                  // console.log("file removed successfully");
                });
              }
            });
          })
          .catch((error) => {
            // console.log({ error });
            res
              .status(500)
              .json({ message: "an error occured while generating thumbnail" });
          });

        // console.log({ fileThumbnail });
      }
    });
  }
);

router.post("/modules/add", authenticate, upload.single("url"), (req, res) => {
  users.findOne({ email: req.user.email }).then(async (user) => {
    if (!user || user?.role !== process.env.ADMIN_KEY) {
      res.status(403).json({
        data: {
          status: "failed",
          message: "access denied",
        },
      });
    } else {
      const id = randomUUID();

      const uploadModule = new moduleTemplateCopy({
        id: req.file?.id,
        courseCode: req.body.courseCode,
        courseTitle: req.body.courseTitle,
        level: req.body.level,
        department: req.body.department,
        thumbnail: req.body.thumbnail,
        likes: 0,
      });

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
          res.status(500).json({ message: "An unknown error occured", error });
        });
    }
  });
});

//fetch single module
router.get("/modules/:id", (req, res) => {
  gfs.files.findOne({ _id: req.params?.id }, (err, file) => {
    if (!file || file.length === 0) {
      return res
        .status(404)
        .json({ message: `Can't find module with id: ${req.params.id}` });
    }

    // console.log({ file });
    if (file?.contentType === "application/pdf") {
      const readstream = gridfsBucket.openDownloadStreamByName(file?.filename);
      readstream.pipe(res);
    } else {
      return res
        .status(404)
        .json({ message: `Can't find module with id: ${req.params.id}` });
    }
  });
});

router.post("/user/create", (req, res) => {
  const id = randomUUID();
  const email = req.body.email;
  const phone = req.body.phone;

  users.findOne({ $or: [{ email: email }, { phone: phone }] }).then((user) => {
    if (phone && phone !== "" && user?.phone === phone) {
      res.status(400).json({ message: "phone already exist" });
    } else if (user?.email === email) {
      res.status(400).json({ message: "email already exist" });
    } else {
      bcrypt.hash(req.body.password, 10, function (err, hashedPwd) {
        if (err) {
          // console.log(err);
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
    }),
]);

router.post("/user/verify", authenticate, (req, res) => {
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
});

router.post("/add-to-favorites", authenticate, async (req, res) => {
  // console.log(req.body, req.user);
  let prevModules;

  let action;

  await users
    .findOne({ email: req.user.email })
    .then((user) => (prevModules = user?.favorite_modules))
    .catch((error) => res.status(500).json({ message: "failed", error }));

  // console.log({ prevModules });
  if (prevModules?.includes(req.body.id)) {
    action = "removed";
  } else {
    action = "added";
  }

  await users
    .findOneAndUpdate(
      { email: req.user.email },
      {
        favorite_modules: prevModules?.includes(req.body.id)
          ? prevModules.filter((module) => module !== req.body?.id)
          : [...prevModules, req.body.id],
      }
    )
    .then((user) => {
      // console.log({ user });
      res.status(201).json({ message: action });
    })
    .catch((error) => {
      res.status(500).json({ message: "failed", error });
    });
});

//** ADMIN ROUTES */
router.get("/admin/get-all-users", authenticate, async (req, res) => {
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
});

module.exports = router;
