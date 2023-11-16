const http = require("http");
const dotenv = require("dotenv");
const app = require("./app");
const os = require("os");
const cluster = require("cluster");
const { PDFNet } = require("@pdftron/pdfnet-node");

dotenv.config();

const PORT = process.env.PORT || 5000;

const { mongoConnect } = require("./services/mongo");

PDFNet.initialize(
  "demo:1673115747462:7d768bde03000000006a78f30f0be721ac209e5513083031a66ed7fded"
);
const server = http.createServer(app);

function runClusters() {
  if (cluster.isMaster) {
    const numOfCores = 3;
    for (let i = 0; i < numOfCores; i++) {
      cluster.fork();
    }
  } else {
    server.listen(PORT, () => {
      console.log("server started...");
    });
  }
}

function runSingleServer() {
  server.listen(PORT, () => {
    console.log("server started...");
  });
}

async function startServer() {
  await mongoConnect();

  process.env.NODE_ENV === "development" ? runClusters() : runSingleServer();
}

startServer();
