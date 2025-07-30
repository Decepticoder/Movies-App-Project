const { Schema, model } = require("mongoose");

const movieSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    year: { type: Number, required: true },
    genres: { type: [String], default: [] },
    rating: { type: Number, min: 0, max: 10, default: 0 },
    owner: { type: Schema.Types.ObjectId, ref: "User" }, // for Phase 3
  },
  { timestamps: true }
);

module.exports = model("Movie", movieSchema);
