const { response } = require("express");
const { randomUUID } = require("crypto");
const express = require("express");
const router = express.Router();
const moduleTemplateCopy = require("./models/createModule");
const storeModuleTemplateCopy = require("./models/storeModule");

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
router.post("/modules/add", (req, res) => {
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
          res.status(201).json(data);
        })
        .catch((error) => {
          res.json(error);
        });
    })
    .catch((error) => console.log(error));
});

module.exports = router;
