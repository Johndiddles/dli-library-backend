const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connection.once("open", () => {
  console.log("MongoDB connection is ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  mongoose.connect(process.env.DATABASE_ACCESS, () => {
    console.log("database is connected");
  });
}

async function mongoDisconnect() {
  mongoose.disconnect(process.env.DATABASE_ACCESS, () => {
    console.log("DB is disconnected");
  });
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
