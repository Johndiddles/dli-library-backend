const users = require("../models/userModule");
const pastQuestions = require("../models/pastQuestions");

async function updatePastQuestion(req, res) {
  const { id } = req.params;
  const pastQuestionUpdate = req.body;
  try {
    const updatedPastQuestion = await pastQuestions.updateOne(
      { id },
      pastQuestionUpdate
    );
    if (updatedPastQuestion.modifiedCount === 1) {
      res.status(200).json({
        status: "success",
        message: "past question updated successfully",
      });
    }
  } catch (error) {
    console.log({ error });
    res.status(400).json({
      status: "failed",
      message: "failed to update past question",
      error,
    });
  }
}

module.exports = updatePastQuestion;
