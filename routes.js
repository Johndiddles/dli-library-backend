const express = require("express");
const router = express.Router();
const methodOverride = require("method-override");
const getAllDepartments = require("./controllers/getAllDepartments");
const createContactMessage = require("./controllers/createContactMessage");
const wakeServerCron = require("./controllers/wakeServerCron");
const userRoutes = require("./routes/v1Routes/userRoutes");
const adminRoutes = require("./routes/v1Routes/adminRoutes");
const { moduleRoutes } = require("./routes/v1Routes/moduleRoutes");

router.use(methodOverride("_method"));

router.use("/modules", moduleRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);

router.get("/departments", getAllDepartments);
//** CONTACT \ SUPPORT FORM **//
router.post("/create-contact-message", createContactMessage);

//** CRON */
router.get("/cron", wakeServerCron);

module.exports = { router };
