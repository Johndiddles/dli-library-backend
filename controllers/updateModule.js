const users = require("../models/userModule");
const moduleTemplateCopy = require("../models/createModule");

async function updateModule(req, res) {
  const { id } = req.params;
  const moduleUpdates = req.body;
  users.findOne({ email: req.user.email }).then(async (user) => {
    if (!user || user?.role !== process.env.ADMIN_KEY) {
      res.status(403).json({
        data: {
          status: "failed",
          message: "access denied",
        },
      });
    } else {
      try {
        const updatedModule = await moduleTemplateCopy.updateOne(
          { id },
          moduleUpdates
        );
        if (updatedModule.modifiedCount === 1) {
          res.status(200).json({
            status: "success",
            message: "module updated successfully",
          });
        }
      } catch (error) {
        console.log({ error });
        res.status(400).json({
          status: "failed",
          message: "failed to update module",
          error,
        });
      }
    }
  });
}

module.exports = updateModule;
