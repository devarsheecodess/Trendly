const express = require("express");
const router = express.Router();

// Models
const User = require("../models/UserModel");
const Onboarding = require("../models/OnbordingModel");

router.get("/profile", async (req, res) => {
  const userId = req.query.userId;
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

    const data = {
      name: user.name,
      avatar: onboarding.avatar,
      email: user.email,
      phone: user.contact,
      address: user.address,
      country: user.country,
      channelName: onboarding.channelName,
      contentNiche: onboarding.contentNiche,
      ageGroups: onboarding.ageGroups,
      audienceInterests: onboarding.audienceInterests,
    };

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
