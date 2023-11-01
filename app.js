const express = require("express");
const cors = require("cors");
const { router: routes } = require("./routes");
require("dotenv").config();

const app = express();

app.use(express.json({ limit: "200mb" }));
app.use(cors());

app.use("/api/v1", routes);

module.exports = app;
