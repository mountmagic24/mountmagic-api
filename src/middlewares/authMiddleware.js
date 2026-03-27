const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found " });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not Authorized" });
    }
    if (!token) {
      return res.status(401).json({ message: "No token Provided" });
    }
  }
};

module.exports = protect;
