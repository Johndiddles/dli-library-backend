const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fileupload = require("express-fileupload");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const authenticate = require("./middlewares/authentication");
const path = require("path");
const getAllModules = require("./controllers/getAllModules");
const getModuleFileById = require("./controllers/getModuleFileById");
const getAllDepartments = require("./controllers/getAllDepartments");
const getRecentModules = require("./controllers/getRecentModules");
const getSingleModuleById = require("./controllers/getSingleModuleById");
const createUserController = require("./controllers/createUser");
const createContactMessage = require("./controllers/createContactMessage");
const loginUser = require("./controllers/loginUser");
const addModule = require("./controllers/addModule");
const getContactMessage = require("./controllers/getContactMessage");
const addDepartment = require("./controllers/addDepartment");
const verifyUser = require("./controllers/verifyUser");
const addModuleToFavorite = require("./controllers/addModuleToFavorite");
const getAllUsers = require("./controllers/getAllUsers");
const wakeServerCron = require("./controllers/wakeServerCron");
const createModuleThumbnail = require("./controllers/createModuleThumbnail");

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

router.get("/departments", getAllDepartments);

//* MODULES *//
router.get("/modules", getAllModules);
router.get("/get-single-module/:id", getSingleModuleById);
router.get("/get-recent-modules", getRecentModules);
router.get("/modules/:id", (req, res) =>
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
router.post(
  "/modules/createThumbnail",
  authenticate,
  fileupload({ createParentPath: true }),
  createModuleThumbnail
);
router.post("/modules/add", authenticate, upload.single("url"), addModule);

//fetch single module in pdf
router.post("/user/create", createUserController);
router.post("/user/login", loginUser);
router.post("/user/verify", authenticate, verifyUser);
router.post("/add-to-favorites", authenticate, addModuleToFavorite);

//** CONTACT \ SUPPORT FORM **//
router.post("/create-contact-message", createContactMessage);

//** ADMIN ROUTES */
router.get("/admin/get-all-users", authenticate, getAllUsers);
router.get("/admin/get-contact-messages", authenticate, getContactMessage);
router.post("/admin/add-department", authenticate, addDepartment);
//** END - ADMIN ROUTES */

//** CRON */
router.get("/cron", wakeServerCron);

module.exports = { router, gfs, gridfsBucket };
