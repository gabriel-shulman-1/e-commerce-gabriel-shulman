const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { createHash, isValidPassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/jwt");
const authController = require("../controller/auth.controller");

router.post("/register", authController.register);

router.post("/login", authController.login);
module.exports = router;
