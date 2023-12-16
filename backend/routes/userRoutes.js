const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/getUsers").get(userController.getUsers);
router.route("/getUser").post(userController.getUser);
router.route("/uploadCover").post(userController.uploadCover);
router.route("/uploadProfile").post(userController.uploadProfile);


module.exports = router;
