const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.send("Auth Route");
});

// Import Models
const User = require("../models/UserModel");
const Onboarding = require("../models/OnbordingModel");

const app = express();
// Middleware for JSON handling
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

// Signup Route
router.post("/signup", async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    // Throw a validation if username is already taken
    const user = await User.findOne({ username: data.username });
    if (user) {
      return res
        .status(400)
        .send({ success: false, message: "Username already taken" });
    }
    // Throw validation if email is already taken
    const email = await User.findOne({ email: data.email });
    if (email) {
      return res
        .status(400)
        .send({ success: false, message: "Email already taken" });
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const newuser = new User(data);
    await newuser.save();
    res.status(201).send({
      success: true,
      userId: newuser._id,
      name: newuser.name,
      youtube: newuser.youtube,
    });
  } catch (err) {
    console.log(err);
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.status(200).send({
        success: true,
        userId: user._id,
        name: user.name,
        youtube: user.youtube,
      });
    } else {
      res.status(401).send({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

// Onboarding user
router.post("/onboarding", async (req, res) => {
  const data = req.body;
  try {
    const newOnboarding = new Onboarding(data);
    await newOnboarding.save();

    // fetch name and youtube channel name from user model
    const user = await User.findOne({ _id: data.userId });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    const name = user.name;
    const youtube = user.youtube;
    res
      .status(201)
      .send({
        success: true,
        username: name,
        youtube: youtube,
        avatar: data.avatar,
      });
  } catch (err) {
    console.log(err);
  }
});

// Check if user is onboarded
router.get("/onboarding", async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await Onboarding.findOne({ userId: userId });
    if (user) {
      res.status(200).send({ success: true, onboarding: true });
    } else {
      res.status(200).send({ success: true, onboarding: false });
    }
  } catch (err) {
    console.log(err);
  }
});

// Fetch avatar
router.get("/avatar", async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await Onboarding.findOne({ userId: userId });
    if (user) {
      res.status(200).send({ success: true, avatar: user.avatar });
    } else {
      res.status(200).send({ success: false, avatar: "" });
    }
  } catch (err) {
    console.log(err);
  }
});

// Get channel name
router.get("/channel", async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.status(200).send({ success: true, youtube: user.youtube });
    } else {
      res.status(200).send({ success: false, youtube: "" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
