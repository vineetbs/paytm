const jwt = require("jsonwebtoken");
const JWT_SECRET = require("./config");
const authMiddleware = (res, req, next) => {
  try {
    const auth = req.header("authorization");
    if (!auth || !auth.startsWith("Bearer")) {
      res.status(403).json("wrong credentials");
    }
    const token = auth.split("")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json("invalid useroken");
  }
};
module.exports = authMiddleware;
