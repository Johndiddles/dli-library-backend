const department = require("../models/departmentModule");

const addDepartment = async (req, res) => {
  const { title, value } = req.body;
  if (title?.trim() === "" || value?.trim() === "") {
    return res.status(400)?.json({
      data: {
        status: "failed",
        message: "Invalid details",
      },
    });
  }

  department.findOne({ value }).then(async (dept) => {
    if (!dept) {
      const new_department = new department({
        title,
        value,
      });

      new_department
        .save()
        .then((data) => {
          res.status(201).json({
            data: {
              status: "success",
              message: "Department created successfully",
            },
          });
        })
        .catch((error) => {
          console.log({ error });
          res.status(500).json({
            message: "Unexpected Error",
            error: error.errors,
          });
        });
    } else {
      res.status(409).json({
        data: {
          status: "failed",
          message: "Department already exist",
        },
      });
    }
  });
};

module.exports = addDepartment;
