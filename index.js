const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

mongoose.connect(process.env.DATABASE_ACCESS, () => {
  console.log("database is connected");
});

app.use(express.json({ limit: "200mb" }));
app.use(cors());
app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`);
});
