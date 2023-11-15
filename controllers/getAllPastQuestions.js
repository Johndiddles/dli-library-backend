const pastQuestion = require("../models/pastQuestions");

const getAllPastQuestions = async (req, res) => {
  pastQuestion
    .find()
    .then((response) => {
      res
        .status(200)
        .json(
          response?.sort((a, b) => Number(b?.createdAt) - Number(a?.createdAt))
        );
    })
    .catch((error) => console.log(error));
};

module.exports = getAllPastQuestions;
