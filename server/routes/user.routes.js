const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const protect = require("../utils/auth.middleware");

router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.post("/logout", controller.logoutUser);
router.get("/userProfile", protect, controller.getUserProfile);

module.exports = router;
