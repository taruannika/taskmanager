const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.post("/logout", controller.logoutUser);

module.exports = router;
