const moduleTemplateCopy = require("../models/createModule");

const getSingleModuleById = async (req, res) => {
  moduleTemplateCopy
    .findOne({ id: req.params?.id })
    .then((response) => {
      // console.log(response);
      res.status(200).json(response);
    })
    .catch((error) => console.log(error));
};

module.exports = getSingleModuleById;
