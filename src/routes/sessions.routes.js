const express = require("express");
const router = express.Router();
const passport = require("passport");
const sessionController = require("../controller/session.controller");

router.post("/login", sessionController.login);
router.get("/current",passport.authenticate("jwt", { session: false }),sessionController.current);

module.exports = router;