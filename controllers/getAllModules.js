const moduleTemplateCopy = require("../models/createModule");

const getAllModules = async (req, res) => {
  moduleTemplateCopy
    .find()
    .then((response) => {
      res
        .status(200)
        .json(response?.sort((a, b) => Number(b?.date) - Number(a?.date)));
    })
    .catch((error) => console.log(error));
};

module.exports = getAllModules;
