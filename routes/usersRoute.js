const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Token = require("../models/token");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

router.route("/login").post(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.send(user);
    } else {
      return res.status(400).json({ msg: "User is not registered" });
    }
  } catch (error) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }
});

router.route("/register").post(async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(401).send({ msg: "Email already Registered" });
    }
    const newuser = new User(req.body);
    await newuser.save();
    res.send({ msg: "User registered successfully" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.route("/forgotpassword").post(async (req, res) => {
  // console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({msg:"Email is not registered"});
    }
    // console.log(user);
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: jwt.sign({ id: user._id }, process.env.secret_key),
      }).save();
    }
    // console.log(token);
    const link = `https://kingcars-rental.netlify.app/resetpassword/${user._id}/${token.token}`;
    await sendEmail(user.email, link, user.username);
    res.send("password reset link send to your email account");
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

router.route("/password-reset/:userId/:token").post(async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(400).send("Invalid link or expired");
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).send("Invalid link or expired");
    }
    // console.log(token);
    user.password = req.body.password;
    await user.save();
    await token.delete();

    res.send("Password reset successfully");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

module.exports = router;
