const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = express.Router();
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || process.env.EXPRESS_SESSION_SECRET || "change_this_secret";
const User = require("../models/UserModel");

router.use(cookieParser());

// Passport setup
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_REDIRECT_URI,
		},
		async (accessToken, refreshToken, profile, cb) => {
			try {
				const email = profile.emails && profile.emails[0] && profile.emails[0].value;
				if (!email) return cb(new Error("No email found in Google profile"));

				let existingUser = await User.findOne({ email: email });

				if (existingUser) {
					existingUser.isNewUser = false;
					return cb(null, existingUser);
				} else {
					const newUser = new User({
						email: email,
						name: profile.displayName || "",
					});
					const savedUser = await newUser.save();
					savedUser.isNewUser = true;
					return cb(null, savedUser);
				}
			} catch (err) {
				return cb(err);
			}
		}
	)
);

// Initiate Google OAuth
router.get(
	"/user/login/google",
	passport.initialize(),
	passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// Callback - issue JWT in secure HttpOnly cookie and redirect without sensitive query params
router.get("/user/login/google/callback", passport.initialize(), (req, res, next) => {
	// Use custom callback to avoid passport trying to establish a session
	passport.authenticate("google", { session: false }, async (err, user, info) => {
		try {
			if (err) {
				console.error('Passport error:', err);
				return res.redirect(`${FRONTEND_URL}/auth?error=auth_failed`);
			}
			if (!user) {
				return res.redirect(`${FRONTEND_URL}/auth?error=auth_failed`);
			}

			// Create JWT payload and sign
			const payload = { id: user._id, name: user.name, email: user.email };
			const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

			// For environments where cookies are not desired (e.g., Render without shared domain),
			// return token to frontend via URL fragment so frontend can store it in localStorage.
			// Note: fragment is not sent to the server so token will only be visible to browser JS.
			if (user.isNewUser) {
				return res.redirect(`${FRONTEND_URL}/oauth/details#token=${token}&new=1`);
			} else {
				return res.redirect(`${FRONTEND_URL}/dashboard#token=${token}`);
			}
		} catch (e) {
			console.error('Callback handler error:', e);
			return res.redirect(`${FRONTEND_URL}/auth?error=internal`);
		}
	})(req, res, next);
});

// Logout - clear the JWT cookie
router.get("/user/logout", function (req, res) {
	// For token-in-localstorage flow, frontend should simply remove the token locally
	res.json({ success: true });
});

// Endpoint to update user info after OAuth signup
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

// Public endpoint: return current user info based on JWT cookie
router.get("/me", async (req, res) => {
	try {
		const token = req.cookies && req.cookies.token;
		if (!token) return res.status(401).json({ success: false, message: "No token" });

		const decoded = jwt.verify(token, JWT_SECRET);
		const user = await User.findById(decoded.id).select("_id name email youtube");
		if (!user) return res.status(404).json({ success: false, message: "User not found" });

		res.json({ success: true, user: { userId: user._id, name: user.name, email: user.email, youtube: user.youtube } });
	} catch (err) {
		console.error("/oauth/me error:", err.message || err);
		return res.status(401).json({ success: false, message: "Invalid token" });
	}
});

module.exports = router;
