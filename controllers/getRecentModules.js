const moduleTemplateCopy = require("../models/createModule");

const getRecentModules = async (req, res) => {
  moduleTemplateCopy.find().then((response) => {
    res
      .status(201)
      .json(
        response?.sort((a, b) => Number(b?.date) - Number(a?.date))?.slice(0, 3)
      );
  });
  // .catch((error) => console.log(error));
};

module.exports = getRecentModules;
