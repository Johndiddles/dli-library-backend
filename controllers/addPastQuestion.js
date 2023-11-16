// const users = require("../models/userModule");
const pastQuestion = require("../models/pastQuestions");

const addPastQuestion = async (req, res) => {
  const duplicate = await pastQuestion.findOne({
    courseId: req.body.courseId,
    session: req.body.session,
  });
  if (duplicate) {
    return res.status(400).json({
      status: "failed",
      message: "past question already exist",
    });
  }

  const newPastQuestion = new pastQuestion({
    id: req.file?.id,
    courseId: req.body.courseId,
    courseCode: req.body.courseCode,
    courseTitle: req.body.courseTitle,
    departments: req.body.departments,
    level: req.body.level,
    session: req.body.session,
    thumbnail: req.body.thumbnail,
    likes: 0,
  });

  newPastQuestion
    .save()
    .then((data) => {
      res.status(201).json({
        data: {
          status: "success",
          message: "past question uploaded successfully",
          data: data,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "An unknown error occured", error });
    });
};

module.exports = addPastQuestion;
