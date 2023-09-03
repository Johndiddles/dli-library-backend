const wakeServerCron = async (req, res) => {
  res.status(200).json({ message: "successfully pinged" });
};

module.exports = wakeServerCron;
