const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.send("Auth Route");
});

// Import Models
const User = require("../models/UserModel");

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
    res.status(201).send({ success: true, userId: newuser._id });
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
      res
        .status(200)
        .send({ success: true, userId: user._id, name: user.name });
    } else {
      res.status(401).send({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

module.exports = router;
