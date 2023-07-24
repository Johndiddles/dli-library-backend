const { gfs, gridfsBucket } = require("../routes");

const getModuleById = async (req, res) => {
  gfs.files.findOne({ _id: req.params?.id }, (err, file) => {
    if (!file || file.length === 0) {
      return res
        .status(404)
        .json({ message: `Can't find module with id: ${req.params.id}` });
    }

    console.log({ res });
    if (file?.contentType === "application/pdf") {
      const readstream = gridfsBucket.openDownloadStreamByName(file?.filename);
      readstream.pipe(res);
    } else {
      return res
        .status(404)
        .json({ message: `Can't find module with id: ${req.params.id}` });
    }
  });
};

// (req, res) => {
//   moduleTemplateCopy
//     .findOne({ id: req.params?.id })
//     .then((response) => {
//       // console.log(response);
//       res.status(200).json(response);
//     })
//     .catch((error) => console.log(error));
// };

module.exports = getModuleById;
