const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.route("/login").post(authController.login);
router.route("/register").post(authController.register);
router.route("/update").post(authController.update);

module.exports = router;
