const pastQuestions = require("../models/pastQuestions");

const getPastQuestionsByCourseId = async (req, res) => {
  pastQuestions
    .find({ courseId: req.params?.courseId })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => console.log(error));
};

module.exports = getPastQuestionsByCourseId;
