const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.route("/getChats").post(chatController.getChats);
router.route("/getChat").post(chatController.getChat);
router.route("/getConversations").post(chatController.getConversations);
router.route("/sendChat").post(chatController.sendChat);

module.exports = router;
