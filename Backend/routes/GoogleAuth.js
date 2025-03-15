const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const session = require("express-session");
const router = express.Router();
const cookieParser = require("cookie-parser");

router.use(cookieParser());

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
          // If no user is found, return an error
          return cb(new Error("Email address not found"));
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
    const user = await User.find({ _id: id });
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
        res.cookie("userName", user.name);
        res.cookie("userId", user.id);

        // Redirect to your frontend
        res.redirect(`${FRONTEND_URL}/dashboard`);
      } else {
        // If no user is found, render a page with an alert
        res.render("auth", { message: "Email address not found" });
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

module.exports = router;
