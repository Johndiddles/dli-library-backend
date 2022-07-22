const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_AUTH_SECRET_KEY);

    req.user = decode;
    next();
  } catch (error) {
    res.status(403).json({
      data: {
        status: "rejected",
        message: "access denied",
      },
    });
  }
};

module.exports = authenticate;
