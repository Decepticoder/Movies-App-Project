const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

// ─── User Schema ─────────────────────────────────────────────────────
// Defines how user data is stored in MongoDB.
// Each user has a unique email and a hashed password.
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// ─── Hash Password Before Save ───────────────────────────────────────
// If the password is new or modified, hash it before saving to DB.
// This runs automatically when calling user.save()
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password isn't changing

  try {
    this.password = await bcrypt.hash(this.password, 12); // Hash with salt rounds = 12
    next();
  } catch (err) {
    next(err);
  }
});

// ─── Compare Password for Login ──────────────────────────────────────
// Adds a method to the user model to compare entered password to stored hash.
// Usage: user.comparePassword(password) → returns true/false
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Export Model ─────────────────────────────────────────────────────
module.exports = model("User", userSchema);
