const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  chatType: {
    type: String,
    required: true,
  },
  chat: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
