const users = require("../models/userModule");
const moduleTemplateCopy = require("../models/createModule");

async function getFavouriteModules(req, res) {
  //   console.log({ user: req.user });
  users.findOne({ email: req.user.email }).then(async (user) => {
    if (!user || user?.role !== process.env.ADMIN_KEY) {
      res.status(403).json({
        data: {
          status: "failed",
          message: "access denied",
        },
      });
    } else {
      const favouriteModules = user.favorite_modules || [];

      if (favouriteModules?.length > 0) {
        let modules = await getModules(favouriteModules);
        res.status(200).json({ modules });
      } else {
        res.status(200).json({ modules: [] });
      }
    }
  });
}

async function getModules(favouriteModules) {
  let modulesList = [];
  for (let i = 0; i < favouriteModules.length; i++) {
    const favModule = await moduleTemplateCopy.findOne({
      id: favouriteModules[i],
    });

    if (favModule) {
      modulesList.push({
        id: "c459c6a446e85bb18d361744dc7b5fbb",
        courseCode: favModule.courseCode,
        courseTitle: favModule.courseTitle,
        level: favModule.level,
        department: favModule.department,
        thumbnail: favModule.thumbnail,
        likes: favModule.likes,
      });
    }
  }

  return modulesList;
}

module.exports = getFavouriteModules;
