const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getChatMessages,
  fetchChats,
} = require("../controllers/chat.controller");

router.get("/list/:userId", fetchChats);

router.get("/:senderId/:receiverId", getChatMessages);

router.post("/send", sendMessage);

module.exports = router;
