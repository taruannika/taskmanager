const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies) {
    token = req.cookies.token;

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decodedToken.id);

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      next(error);
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
});

module.exports = protect;
