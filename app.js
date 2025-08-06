const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session"); // ─── Sessions ───────────────────────────────
const movieRoutes = require("./routes/movies");
const authRoutes = require("./routes/auth"); // ─── Auth Routes ────────────────────────────

// ─── Database Connection ────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/movies-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
// ─────────────────────────────────────────────────────────────────────

const app = express();

// ─── Middleware ─────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));

// ─── Session Setup ──────────────────────────────────────────────────
app.use(session({
  secret: "movie-secret", // ⚠️ Use process.env.SECRET in production
  resave: false,
  saveUninitialized: false,
}));

// ─── Make Session User Available to Views ───────────────────────────
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

// ─── View Engine ────────────────────────────────────────────────────
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// ─── Routes ─────────────────────────────────────────────────────────
app.use("/", authRoutes);     // 👤 Register, Login, Logout
app.use("/", movieRoutes);    // 🎬 Movie CRUD

// ─── Server Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
