const users = require("../models/userModule");
const moduleTemplateCopy = require("../models/createModule");

const addModule = async (req, res) => {
  users.findOne({ email: req.user.email }).then(async (user) => {
    if (!user || user?.role !== process.env.ADMIN_KEY) {
      res.status(403).json({
        data: {
          status: "failed",
          message: "access denied",
        },
      });
    } else {
      //   const id = randomUUID();

      const newModule = new moduleTemplateCopy({
        id: req.file?.id,
        courseCode: req.body.courseCode,
        courseTitle: req.body.courseTitle,
        level: req.body.level,
        department: req.body.department,
        thumbnail: req.body.thumbnail,
        likes: 0,
      });

      newModule
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
};

module.exports = addModule;
