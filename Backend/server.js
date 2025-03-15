require("dotenv").config(); // Load environment variables
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/AuthRoutes");
const googleAuthRoutes = require("./routes/GoogleAuth");
const ScriptRoute = require("./routes/mainRoutes/ScriptRoute");

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
