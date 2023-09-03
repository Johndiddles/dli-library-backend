const users = require("../models/userModule");

const addModuleToFavorite = async (req, res) => {
  // console.log(req.body, req.user);
  let prevModules;

  let action;

  await users
    .findOne({ email: req.user.email })
    .then((user) => (prevModules = user?.favorite_modules))
    .catch((error) => res.status(500).json({ message: "failed", error }));

  // console.log({ prevModules });
  if (prevModules?.includes(req.body.id)) {
    action = "removed";
  } else {
    action = "added";
  }

  await users
    .findOneAndUpdate(
      { email: req.user.email },
      {
        favorite_modules: prevModules?.includes(req.body.id)
          ? prevModules.filter((module) => module !== req.body?.id)
          : [...prevModules, req.body.id],
      }
    )
    .then(() => {
      // console.log({ user });
      res.status(201).json({ message: action });
    })
    .catch((error) => {
      res.status(500).json({ message: "failed", error });
    });
};

module.exports = addModuleToFavorite;
