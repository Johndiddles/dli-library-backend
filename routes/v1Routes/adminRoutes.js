const express = require("express");
const authenticate = require("../../middlewares/authentication");
const getAllUsers = require("../../controllers/getAllUsers");
const getContactMessage = require("../../controllers/getContactMessage");
const addDepartment = require("../../controllers/addDepartment");
const adminRoutes = express.Router();

adminRoutes.get("/get-all-users", authenticate, getAllUsers);
adminRoutes.get("/get-contact-messages", authenticate, getContactMessage);
adminRoutes.post("/add-department", authenticate, addDepartment);

module.exports = adminRoutes;
