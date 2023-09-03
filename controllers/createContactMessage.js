const { randomUUID } = require("crypto");
const support = require("../models/contactModule");

const createContactMessage = async (req, res) => {
  const id = randomUUID();
  const { contact_info, full_name, message } = req.body;

  const new_message = new support({
    id: id,
    full_name,
    contact_info,
    message,
  });

  new_message
    .save()
    .then(() => {
      res.status(201).json({
        data: {
          status: "success",
          message: "message sent successfully",
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Unexpected Error",
        error: error.errors,
      });
    });
};

module.exports = createContactMessage;
