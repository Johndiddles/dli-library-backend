const users = require("../models/userModule");

async function isAdmin(req, res, next) {
  users.findOne({ email: req.user.email }).then(async (user) => {
    if (!user || user?.role !== process.env.ADMIN_KEY) {
      res.status(403).json({
        data: {
          status: "failed",
          message: "access denied",
        },
      });
    } else {
      req.user.favorite_modules = user.favorite_modules;
      next();
    }
  });
}

module.exports = isAdmin;
