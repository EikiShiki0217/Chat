const Chat = require("../models/Chat");
const User = require("../models/User");
const mongoose = require("mongoose");

const getChats = async (req, res) => {
  const { himId, myId } = req.body;
  // Get all users from MongoDB
  const chats = await Chat.find({
    $or: [
      { $and: [{ senderId: myId }, { receiverId: himId }] },
      { $and: [{ receiverId: myId }, { senderId: himId }] },
    ],
  }).sort({ timestamp: -1 });

  if (!chats?.length) {
    return res.status(400).json({ message: "No chat found" });
  }
  res.json(chats);
};

const getChat = async (req, res) => {
  const { chatId } = req.body;
  // Get all users from MongoDB
  const c = await Chat.find({_id: new mongoose.Types.ObjectId(chatId)});
  if (!c?.length) {
    return res.status(400).json({ message: "No chat found" });
  }
  res.json(c);
};

const getConversations = async (req, res) => {
  const { myId } = req.body;
  const users = await User.find({ _id: { $ne: new mongoose.Types.ObjectId(myId) } });
  let conversations = [];

  for (const user of users) {
    const conversation = await Chat.find({
      $or: [
        { $and: [{ senderId: myId }, { receiverId: user._id.toString() }] },
        { $and: [{ receiverId: myId }, { senderId: user._id.toString() }] },
      ],
    })
      .sort({ timestamp: -1 })
      .limit(1);

    conversations.push(...conversation);
  }

  res.json(conversations);
};

const sendChat = async (req, res) => {
  const { senderId, receiverId, chatType, chat, timestamp } = req.body;

  const chatObject = { senderId, receiverId, chatType, chat, timestamp };

  const sent = await Chat.create(chatObject);

  // io.emit("dataUpdated", sent);

  if (sent) {
    //created
    res.json(sent._id);
  } else {
    res.status(400).json({ message: "Error" });
  }
};

module.exports = {
  getChats,
  getChat,
  getConversations,
  sendChat,
};
