const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const otpStorage = {}; // Temporary storage, use Redis for production

// Configure Nodemailer Transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
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

  // 4-digit OTP generation
  const otp = Math.floor(1000 + Math.random() * 9000);
  otpStorage[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };
  console.log(email);

  const mailOptions = {
    from: process.env.NODEMAILER_USER, // Replace with your Gmail
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
  console.log("Received email:", email);
  console.log("Received OTP:", otp, typeof otp); // Log OTP and its type

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, error: "Email and OTP are required." });
  }

  const storedOTP = otpStorage[email];
  console.log("Stored OTP:", storedOTP);

  if (!storedOTP) {
    return res
      .status(400)
      .json({ success: false, error: "OTP expired or not found." });
  }

  if (Date.now() > storedOTP.expires) {
    delete otpStorage[email];
    return res.status(400).json({ success: false, error: "OTP expired." });
  }

  if (storedOTP.otp !== Number(otp)) {
    // Convert to number before comparing
    console.log("Stored OTP:", storedOTP.otp, "Received OTP:", otp);
    return res.status(400).json({ success: false, error: "Invalid OTP." });
  }

  delete otpStorage[email]; // Remove OTP after verification
  res.json({ success: true, message: "OTP verified successfully." });
});

module.exports = router;
