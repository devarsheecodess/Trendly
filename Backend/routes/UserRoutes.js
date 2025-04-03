const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const Onboarding = require("../models/OnbordingModel");
const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Fetch user profile
router.get("/profile", async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const [user, onboarding] = await Promise.all([
      User.findById(userId),
      Onboarding.findOne({ userId }),
    ]);

    if (!user || !onboarding) {
      return res
        .status(404)
        .json({ message: "User or onboarding data not found." });
    }

    res.status(200).json({
      name: user.name,
      avatar: onboarding.avatar || null,
      email: user.email,
      phone: user.contact || null,
      address: user.address || null,
      country: user.country || null,
      channelName: onboarding.channelName || null,
      contentNiche: onboarding.contentNiche || null,
      ageGroups: onboarding.ageGroups || [],
      audienceInterests: onboarding.audienceInterests || [],
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Update user profile
router.put("/update", async (req, res) => {
  const {
    userId,
    name,
    avatar,
    email,
    phone,
    address,
    country,
    channelName,
    contentNiche,
    ageGroups,
    audienceInterests,
    password,
  } = req.body;

  if (!userId) {
    console.error("Update failed: Missing userId");
    return res.status(400).json({ message: "User ID is required." });
  }

  // If password is provided, hash it and store in DB
  try {
    const [user, onboarding] = await Promise.all([
      User.findById(userId),
      Onboarding.findOne({ userId }),
    ]);

    if (!user || !onboarding) {
      return res
        .status(404)
        .json({ message: "User or onboarding data not found." });
    }

    // Check if email is being updated and ensure it's not already in use
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use." });
      }
      user.email = email;
    }

    // Update user details
    user.name = name || user.name;
    user.contact = phone || user.contact;
    user.address = address || user.address;
    user.country = country || user.country;
    if (password) {
      const hashedPassword = await hashPassword(password);
      user.password = hashedPassword;
    }
    await user.save();

    // Update onboarding details
    onboarding.avatar = avatar || onboarding.avatar;
    onboarding.channelName = channelName || onboarding.channelName;
    onboarding.contentNiche = contentNiche || onboarding.contentNiche;
    onboarding.ageGroups = Array.isArray(ageGroups)
      ? ageGroups
      : onboarding.ageGroups;
    onboarding.audienceInterests = Array.isArray(audienceInterests)
      ? audienceInterests
      : onboarding.audienceInterests;
    await onboarding.save();

    res.status(200).json({ message: "Profile updated successfully!" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
