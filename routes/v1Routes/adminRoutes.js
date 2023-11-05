const express = require("express");
const authenticate = require("../../middlewares/authentication");
const getAllUsers = require("../../controllers/getAllUsers");
const getContactMessage = require("../../controllers/getContactMessage");
const addDepartment = require("../../controllers/addDepartment");
const isAdmin = require("../../middlewares/isAdmin");
const adminRoutes = express.Router();

adminRoutes.get("/get-all-users", authenticate, isAdmin, getAllUsers);
adminRoutes.get(
  "/get-contact-messages",
  authenticate,
  isAdmin,
  getContactMessage
);
adminRoutes.post("/add-department", authenticate, isAdmin, addDepartment);

module.exports = adminRoutes;
