const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { PDFNet } = require("@pdftron/pdfnet-node");

const Grid = require("gridfs-stream");

dotenv.config();
const { router } = require("./routes");

const PORT = process.env.PORT || 5000;
const app = express();

// let gfs;

// const connectToDB = async () => {
//   const connectDB = async () => {
//     const conn = mongoose.createConnection(process.env.DATABASE_ACCESS);

//     conn.once("open", () => {
//       gfs = Grid(conn.db, mongoose.mongo);
//       gfs.collection("modules");

//       console.log("db is connected...");
//     });
//   };

//   await connectDB();
// };

// connectToDB();

const routes = router;

mongoose.connect(process.env.DATABASE_ACCESS, () => {
  console.log("database is connected");
});

app.use(express.json({ limit: "200mb" }));
app.use(cors());
app.use("/api/v1", routes);

PDFNet.initialize(
  "demo:1673115747462:7d768bde03000000006a78f30f0be721ac209e5513083031a66ed7fded"
);

app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`);
});
