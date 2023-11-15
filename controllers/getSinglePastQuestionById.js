const pastQuestions = require("../models/pastQuestions");

const getSinglePastQuestionById = async (req, res) => {
  pastQuestions
    .findOne({ id: req.params?.id })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => console.log(error));
};

module.exports = getSinglePastQuestionById;
