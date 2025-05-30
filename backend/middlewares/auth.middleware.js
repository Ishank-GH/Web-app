const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blacklistToken = require('../models/blacklistToken.model')

module.exports.authUser = async (req, res, next) => {
  try {
    // Check for Authorization header first, then cookie
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const isBlackListed = await blacklistToken.findOne({ token });
    if (isBlackListed) {
      return res.status(401).json({ message: "Token has been invalidated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Error:', err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
