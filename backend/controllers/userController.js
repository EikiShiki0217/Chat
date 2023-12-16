const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const getUsers = async (req, res) => {
  const users = await User.find().select("username").select("profile").lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
};

const getUser = async (req, res) => {
  const { userId } = req.body;

  try {
    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    // Convert userId to ObjectId and query the database
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const uploadCover = async (req, res) => {
  const { cover, userId } = req.body;
  console.log("sda");
  await User.findOneAndUpdate(
    { _id: userId },
    { $set: { cover: cover } },
    { upsert: true }
  )
    .then(() => console.log("sda"))
    .catch((e) => console.log(e));
  res.json(userId);
};

const uploadProfile = async (req, res) => {
  const { profile, userId } = req.body;
  console.log("sda");
  await User.findOneAndUpdate(
    { _id: userId },
    { $set: { profile: profile } },
    { upsert: true }
  )
    .then(() => console.log("sda"))
    .catch((e) => console.log(e));
  res.json(userId);
};

module.exports = {
  getUsers,
  getUser,
  uploadCover,
  uploadProfile,
};
