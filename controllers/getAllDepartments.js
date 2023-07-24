const departments = require("../models/departmentModule");

const getAllDepartments = async (req, res) => {
  departments
    .find()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => console.log(error));
};

module.exports = getAllDepartments;
