const express = require("express");
const crypto = require("crypto");
const { default: mongoose } = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const fileUpload = require("express-fileupload");
const multer = require("multer");
const Grid = require("gridfs-stream");
const isAdmin = require("../../middlewares/isAdmin");
const addPastQuestion = require("../../controllers/addPastQuestion");
const authenticate = require("../../middlewares/authentication");
const createThumbnail = require("../../controllers/createThumbnail");
const getAllPastQuestions = require("../../controllers/getAllPastQuestions");
const path = require("path");
const getPastQuestionFileById = require("../../controllers/getPastQuestionFileById");
const getSinglePastQuestionById = require("../../controllers/getSinglePastQuestionById");
const getPastQuestionsByCourseId = require("../../controllers/getPastQuestionsByCourseId");
const updatePastQuestion = require("../../controllers/updatePastQuestion");

require("dotenv").config();

const pastQuestionRoutes = express.Router();

let gfs, gridfsBucket;

const connectToDB = async () => {
  const connectDB = async () => {
    const conn = mongoose.createConnection(process.env.DATABASE_ACCESS);

    conn.once("open", () => {
      gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "pastQuestions",
      });

      gfs = Grid(conn.db, mongoose.mongo);
      gfs.collection("pastQuestions");
    });
  };

  await connectDB();
};

connectToDB();

pastQuestionRoutes.get("/", getAllPastQuestions);
pastQuestionRoutes.get(
  "/get-past-questions-by-course-id/:courseId",
  getPastQuestionsByCourseId
);
pastQuestionRoutes.get("/:id", (req, res) =>
  getPastQuestionFileById(req, res, gfs, gridfsBucket)
);
pastQuestionRoutes.get(
  "/get-single-past-question/:id",
  getSinglePastQuestionById
);

//**  add a single past question *//
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
        const filename = `pq-${id}${path.extname(file.originalname)}`;
        const fileInfo = {
          id,
          filename: filename,
          bucketName: "pastQuestions",
        };

        // console.log({ fileInfo });
        resolve(fileInfo);
      });
    });
  },
});

//initialize upload with multer
const upload = multer({ storage });
pastQuestionRoutes.post(
  "/createThumbnail",
  authenticate,
  isAdmin,
  fileUpload({ createParentPath: true }),
  createThumbnail
);
pastQuestionRoutes.post(
  "/add",
  authenticate,
  upload.single("url"),
  addPastQuestion
);
pastQuestionRoutes.patch(
  "/update/:id",
  authenticate,
  isAdmin,
  updatePastQuestion
);

module.exports = { pastQuestionRoutes, gfs, gridfsBucket };
