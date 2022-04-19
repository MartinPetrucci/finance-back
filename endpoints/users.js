const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const Item = require("../models/Item");
const { Types } = mongoose;
const TESTING_USER_ID = "62310f4c8a254e63fd7b1bc9";
const bcrypt = require("bcrypt");

router.use((request, response, next) => {
  next();
});

router.route("/").get(async (request, response) => {
  console.log("paso x users");
  const { userId } = request.query;
  try {
    const findedUser = await User.find({ _id: userId });
    response.json({ findedUser });
  } catch (error) {
    console.error(error);
    response.json(error.message);
  }
});

router.route("/login").post(async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username: username });
  const correct =
    user != null && (await bcrypt.compare(password, user.passwordHash));

  if (!correct) {
    response.status(403).json({ message: "Username or password incorrect" });
  }

  const objectToEncrypt = { name: user.name, id: user._id };
  const token = jwt.sign(objectToEncrypt, process.env.SECRET);

  response.json({...user.toJSON(), token });
});

router.route("/register").post(async (request, response) => {
  const { username, name, password } = request.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const userModel = new User({
    username,
    name,
    passwordHash: passwordHash,
  });
  try {
    const savedUser = await userModel.save();
    response.status(201).json({ savedUser });
  } catch (error) {
    console.error(error);
    response.json(error.message);
  }
});

module.exports = router;
