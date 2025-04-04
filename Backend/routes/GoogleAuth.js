const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const session = require("express-session");
const router = express.Router();
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

router.use(cookieParser());

let googleFlag = false;

const FRONTEND_URL = process.env.FRONTEND_URL; // Replace with your frontend URL
const User = require("../models/UserModel");

// Session setup
router.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET, // Replace with a unique key
    resave: false, // Avoid resaving unchanged sessions
    saveUninitialized: false, // Only save sessions with initialized data
    cookie: {
      secure: false, // Set to true in production if using HTTPS
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // Session expires after 1 hour
    },
  })
);

// Passport setup
router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        if (existingUser) {
          return cb(null, existingUser);
        } else {
          // Create a new user if the email doesn't exist
          const newUser = new User({
            email: profile.emails[0].value,
            name: profile.displayName,
          });

          googleFlag = true; // Set the flag to true for new users

          const savedUser = await newUser.save();
          return cb(null, savedUser);
        }
      } catch (err) {
        // Handle error and return it to the callback
        return cb(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id); // Store user ID
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

// Routes
router.get(
  "/user/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/user/login/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth" }),
  async (req, res) => {
    try {
      const user = req.user;
      if (user) {
        // Successful login logic
        res.cookie("userName", user.name, {
          path: "/",
          httpOnly: true,
          secure: true, // Required for HTTPS
          sameSite: "None", // Required for cross-site cookies
        });

        res.cookie("userId", user.id, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "None",
        });

        // Check if this is a new user (created via Google auth)
        if (googleFlag) {
          // Redirect new users to the details form
          res.redirect(`${FRONTEND_URL}/oauth/details?email=${user.email}`);
        } else {
          // Redirect existing users to dashboard
          res.redirect(`${FRONTEND_URL}/dashboard`);
        }
      } else {
        // If no user is found, render a page with an alert
        res.render("auth", { message: "Authentication failed" });
      }
    } catch (err) {
      console.error(err);
      // Handle error and render a page with an alert
      res.render("auth", { message: "Authentication failed" });
    }
  }
);

router.get("/user/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.clearCookie("userName");
    res.clearCookie("userId");
    res.json({ success: true });
  });
});

router.put("/userinfo", async (req, res) => {
  const { data } = req.body;

  try {
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.contact = data.contact;
    user.address = data.address;
    user.country = data.country;
    user.youtube = data.youtube;
    user.username = data.username;

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(data.password, salt);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User info updated successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
