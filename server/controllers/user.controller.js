const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  const token = generateToken(user.id);

  if (user) {
    const { id, name, email } = user;
    res
      .cookie("token", token, {
        path: "/",
        httpOnly: true,
        maxAge: 30 * 24 * 24 * 60 * 1000,
        sameSite: true,
        secure: true,
      })
      .status(201)
      .json({ id, name, email, token });
  } else {
    res.status(400).json({ message: "Error creating user" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  res.send("Login user");
});

const logoutUser = asyncHandler(async (req, res) => {
  res.send("logout user");
});

module.exports = { registerUser, loginUser, logoutUser };
