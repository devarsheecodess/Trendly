const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();
const otpStorage = {}; // Temporary storage, use Redis for production

// Configure Nodemailer Transporter using Ethereal
const transporter = nodemailer.createTransport({
  host: "",
  port: 587,
  auth: {
    user: "",
    pass: "",
  },
});

// Function to send OTP
router.post("/send", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, error: "Email is required." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  otpStorage[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };
  console.log(email);

  const mailOptions = {
    from: "",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}. It expires in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent to email." });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    res
      .status(500)
      .json({ success: false, error: error.message || "Error sending OTP." });
  }
});

// Function to verify OTP
router.post("/verify", (req, res) => {
  const { email, otp } = req.body;
  const storedOTP = otpStorage[email];

  if (!storedOTP) {
    return res
      .status(400)
      .json({ success: false, error: "OTP expired or not found." });
  }

  if (Date.now() > storedOTP.expires) {
    delete otpStorage[email];
    return res.status(400).json({ success: false, error: "OTP expired." });
  }

  if (storedOTP.otp !== parseInt(otp)) {
    return res.status(400).json({ success: false, error: "Invalid OTP." });
  }

  delete otpStorage[email]; // Remove OTP after verification
  res.json({ success: true, message: "OTP verified successfully." });
});

module.exports = router;
