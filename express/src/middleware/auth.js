const jwt = require("jsonwebtoken");

const api = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "invalid or expired token",
      error: err.message,
    });
  }
};
module.exports = api;
