const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rating: { type: Number, default: 4.2 },
    image: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { _id: false }
);

const costSchema = new mongoose.Schema(
  {
    parking: { type: String, default: "INR 250/day" },
    localTransport: { type: String, default: "INR 1200" },
    foodBudget: { type: String, default: "INR 1800" },
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, unique: true, lowercase: true, trim: true },
    country: { type: String, required: true, trim: true },
    bestTime: { type: String, default: "October to March" },
    places: { type: [placeSchema], default: [] },
    food: { type: [placeSchema], default: [] },
    costs: { type: costSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);
