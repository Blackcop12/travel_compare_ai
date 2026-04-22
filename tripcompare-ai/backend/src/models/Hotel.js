const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true, lowercase: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
  },
  { timestamps: true }
);

hotelSchema.index({ location: 1, price: 1 });

module.exports = mongoose.model("Hotel", hotelSchema);
