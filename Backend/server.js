require("dotenv").config(); // Load environment variables
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/AuthRoutes");
const googleAuthRoutes = require("./routes/GoogleAuth");
const ScriptRoute = require("./routes/mainRoutes/ScriptRoute");
const PromptRoute = require("./routes/mainRoutes/PromptRoute");
const ThumbnailRoute = require("./routes/mainRoutes/ThumbnailRoute");
const SEORoute = require("./routes/mainRoutes/SEORoute");
const UploadRoute = require("./routes/UploadRoute");
const UserRoutes = require("./routes/UserRoutes");
const VoiceoverRoute = require("./routes/mainRoutes/VoiceoverRoute");
const YoutubeRoutes = require("./routes/mainRoutes/YoutubeRoute");
const HistoryRoutes = require("./routes/HistoryRoutes");
const OtpRoutes = require("./routes/OtpRoutes"); // Import OTP Routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON handling
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use(cors());
app.use(cookieParser()); // ✅ This must come before your routes

// Initialize Passport Middleware
app.use(passport.initialize());

// Routes
app.use("/auth", authRoutes);
app.use("/oauth", googleAuthRoutes); // Improved route structure
app.use("/script", ScriptRoute);
app.use("/prompt", PromptRoute);
app.use("/thumbnail", ThumbnailRoute);
app.use("/seo", SEORoute);
app.use("/upload", UploadRoute);
app.use("/user", UserRoutes);
app.use("/voiceover", VoiceoverRoute);
app.use("/youtube", YoutubeRoutes);
app.use("/history", HistoryRoutes);
app.use("/otp", OtpRoutes); // Use OTP Routes

// 404 Middleware - Handles unmatched routes
app.use((req, res) => {
  res.status(404).send({ success: false, message: "Route not found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ success: false, message: "Something went wrong!" });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
