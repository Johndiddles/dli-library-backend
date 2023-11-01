const http = require("http");
const dotenv = require("dotenv");
const app = require("./app");
const { PDFNet } = require("@pdftron/pdfnet-node");

dotenv.config();

const PORT = process.env.PORT || 5000;

const { mongoConnect } = require("./services/mongo");

PDFNet.initialize(
  "demo:1673115747462:7d768bde03000000006a78f30f0be721ac209e5513083031a66ed7fded"
);
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();

  server.listen(PORT, () => {
    console.log("server started...");
  });
}

startServer();
