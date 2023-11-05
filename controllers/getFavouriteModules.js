const users = require("../models/userModule");
const moduleTemplateCopy = require("../models/createModule");

async function getFavouriteModules(req, res) {
  users.findOne({ email: req.user.email }).then(async (user) => {
    const favouriteModules = user.favorite_modules || [];

    if (favouriteModules?.length > 0) {
      let modules = await getModules(favouriteModules);
      res.status(200).json({ modules });
    } else {
      res.status(200).json({ modules: [] });
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
        id: favModule.id,
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
