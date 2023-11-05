const express = require("express");
const crypto = require("crypto");
const getAllModules = require("../../controllers/getAllModules");
const getSingleModuleById = require("../../controllers/getSingleModuleById");
const getRecentModules = require("../../controllers/getRecentModules");
const getModuleFileById = require("../../controllers/getModuleFileById");
const addModule = require("../../controllers/addModule");
const authenticate = require("../../middlewares/authentication");
const createModuleThumbnail = require("../../controllers/createModuleThumbnail");
const fileUpload = require("express-fileupload");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");
const { default: mongoose } = require("mongoose");
const Grid = require("gridfs-stream");
const updateModule = require("../../controllers/updateModule");
const getFavouriteModules = require("../../controllers/getFavouriteModules");
const isAdmin = require("../../middlewares/isAdmin");

require("dotenv").config();

const moduleRoutes = express.Router();

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

moduleRoutes.get("/", getAllModules);
moduleRoutes.get("/get-single-module/:id", getSingleModuleById);
moduleRoutes.get("/recent", getRecentModules);
moduleRoutes.get("/favourites", authenticate, getFavouriteModules);
moduleRoutes.get("/:id", (req, res) =>
  getModuleFileById(req, res, gfs, gridfsBucket)
);

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
moduleRoutes.post(
  "/createThumbnail",
  authenticate,
  fileUpload({ createParentPath: true }),
  createModuleThumbnail
);
moduleRoutes.post(
  "/add",
  authenticate,
  isAdmin,
  upload.single("url"),
  addModule
);
moduleRoutes.patch("/update/:id", authenticate, isAdmin, updateModule);

module.exports = { moduleRoutes, gfs, gridfsBucket };
