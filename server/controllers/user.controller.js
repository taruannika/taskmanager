const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

const cookieOptions = {
  path: "/",
  httpOnly: true,
  maxAge: 30 * 24 * 24 * 60 * 1000,
  sameSite: true,
  secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  const token = generateToken(user.id);

  if (user) {
    const { id, name, email } = user;
    res
      .cookie("token", token, cookieOptions)
      .status(201)
      .json({ id, name, email, token });
  } else {
    res.status(400).json({ message: "Error creating user" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user.id);

  if (user && passwordMatch) {
    const { id, name, email } = user;
    res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({ id, name, email, token });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Successfully logged out user" });
});

module.exports = { registerUser, loginUser, logoutUser };
