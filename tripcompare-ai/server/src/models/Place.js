const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

placeSchema.index({ location: 1, name: 1 });

module.exports = mongoose.model("Place", placeSchema);
