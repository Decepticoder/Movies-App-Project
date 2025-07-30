const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ─── Show Register Form ─────────────────────────────────────────────
router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

// ─── Handle Register Form Submission ────────────────────────────────
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.render("register", { error: "Email already registered." });
    }

    const user = new User({ email, password });
    await user.save();

    req.session.userId = user._id; // Set session to keep user logged in
    res.redirect("/");
  } catch (err) {
    res.render("register", { error: "Registration failed. Please try again." });
  }
});

// ─── Show Login Form ────────────────────────────────────────────────
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// ─── Handle Login Form Submission ───────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", { error: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render("login", { error: "Invalid email or password." });
    }

    req.session.userId = user._id; // 🔐 Save user in session
    res.redirect("/");
  } catch (err) {
    res.render("login", { error: "Login failed. Please try again." });
  }
});

// ─── Logout ─────────────────────────────────────────────────────────
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
