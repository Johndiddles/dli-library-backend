const { PDFNet } = require("@pdftron/pdfnet-node");

const getThumbnail = async (file, output) => {
  const doc = await PDFNet.PDFDoc.createFromFilePath(file);
  await doc.initSecurityHandler();
  const pdfDraw = await PDFNet.PDFDraw.create(92);
  const currPage = await doc.getPage(1);
  await pdfDraw.export(currPage, output, "PNG");

  //   return outputFile;
};

module.exports = getThumbnail;
