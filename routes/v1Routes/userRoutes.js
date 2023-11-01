const express = require("express");
const createUserController = require("../../controllers/createUser");
const loginUser = require("../../controllers/loginUser");
const verifyUser = require("../../controllers/verifyUser");
const addModuleToFavorite = require("../../controllers/addModuleToFavorite");
const authenticate = require("../../middlewares/authentication");
const userRoutes = express.Router();

userRoutes.post("/create", createUserController);
userRoutes.post("/login", loginUser);
userRoutes.post("/verify", authenticate, verifyUser);
userRoutes.post("/add-to-favorites", authenticate, addModuleToFavorite);

module.exports = userRoutes;
