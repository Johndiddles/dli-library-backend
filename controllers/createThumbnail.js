const users = require("../models/userModule");
const path = require("path");
const fs = require("fs");
const { PDFNet } = require("@pdftron/pdfnet-node");

const createThumbnail = (req, res) => {
  users.findOne({ email: req.user.email }).then(async (user) => {
    if (!user || user?.role !== process.env.ADMIN_KEY) {
      res.status(403).json({
        data: {
          status: "failed",
          message: "access denied",
        },
      });
    } else {
      let inputFile = req.files?.module?.data || req.files?.pastQuestion?.data;

      let outputFilePath = path.resolve(
        __dirname,
        `../files/${req.body?.courseCode}.png`
      );

      const getThumbnail = async () => {
        const doc = await PDFNet.PDFDoc.createFromBuffer(inputFile);
        await doc.initSecurityHandler();
        const pdfDraw = await PDFNet.PDFDraw.create(92);
        const currPage = await doc.getPage(1);
        await pdfDraw.export(currPage, outputFilePath, "PNG");
      };

      let fileThumbnail;

      await PDFNet.runWithCleanup(getThumbnail)
        .then(() => {
          fs.readFile(outputFilePath, (err, data) => {
            if (err) {
              console.log({ err });
              res.status(500).json({
                message: "an error occured while generating thumbnail",
                error: err,
              });
            } else {
              fileThumbnail = data;
              res.setHeader("ContentType", "image/png").status(201).json({
                message: "successfully generated thumbnail",
                data: data,
              });

              fs.unlink(outputFilePath, () => {});
            }
          });
        })
        .catch((error) => {
          console.log({ error });
          res
            .status(500)
            .json({ message: "an error occured while generating thumbnail" });
        });
    }
  });
};

module.exports = createThumbnail;
