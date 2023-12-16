const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const login = async (req, res) => {
  const { loginName, password } = req.body;
  let foundUser;
  if (isValidEmail(loginName)) {
    foundUser = await User.findOne({ email: loginName }).exec();
  } else if (isEightDigitNumber(loginName)) {
    foundUser = await User.findOne({ phone: loginName }).exec();
  } else {
    return res.status(400).json({ message: "Нэвтрэх нэр буруу байна." });
  }

  if (!foundUser) {
    return res.status(401).json({ message: "Бүртгэлгүй байна." });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Нууц үг буруу байна." });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser.id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  res.cookie("jwt", accessToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  res.json({ accessToken });
};

function isEightDigitNumber(str) {
  const eightDigitNumberRegex = /^\d{8}$/;
  return eightDigitNumberRegex.test(str);
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const register = async (req, res) => {
  const { username, profile, email, phone, password, passwordConfirmation } =
    req.body;

  if (password !== passwordConfirmation) {
    return res
      .status(400)
      .json({ message: "Нууц үг баталгаажуулалт буруу байна." });
  }

  if (!isEightDigitNumber(phone)) {
    return res.status(400).json({ message: "Утасны дугаар буруу байна." });
  }

  const duplicate = await User.findOne({ $or: [{ email }, { phone }] })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(401).json({ message: "Хэрэглэгч бүртгэлтэй байна." });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = {
    username,
    profile,
    cover: null,
    email,
    phone,
    password: hashedPwd,
  };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: "Амжилттай бүртгэлээ." });
  }
};

const update = async (req, res) => {
  const { myId, username, email, phone, password, passwordConfirmation } =
    req.body;

  if (password !== passwordConfirmation) {
    return res
      .status(400)
      .json({ message: "Нууц үг баталгаажуулалт буруу байна." });
  }

  if (!isEightDigitNumber(phone)) {
    return res.status(400).json({ message: "Утасны дугаар буруу байна." });
  }

  let duplicate = await User.findOne({
    _id: new mongoose.Types.ObjectId(myId),
  });

  if (username !== undefined) {
    duplicate.username = username;
  }

  if (email !== undefined) {
    duplicate.email = email;
  }

  if (phone !== undefined) {
    duplicate.phone = phone;
  }

  if (password !== undefined) {
    const hashedPwd = await bcrypt.hash(password, 10);
    duplicate.password = hashedPwd;
  }

  const result = User.updateOne(
    {
      _id: new mongoose.Types.ObjectId(myId),
    },
    { $set: duplicate }
  );

  console.log(result)

  if (result) {
    res.status(201).json({ message: "Амжилттай бүртгэлээ." });
  } else {
    res.status(400).json({ message: "Failed" });
  }
};

module.exports = {
  login,
  register,
  update,
};
