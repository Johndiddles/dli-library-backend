const getModuleFileById = async (req, res, gfs, gridfsBucket) => {
  gfs.files.findOne({ _id: req.params?.id }, (err, file) => {
    if (!file || file.length === 0) {
      return res
        .status(404)
        .json({ message: `Can't find module with id: ${req.params.id}` });
    }

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

module.exports = getModuleFileById;
