const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ["Food", "Shopping", "Rides"], required: true },
    platform: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    deliveryTime: { type: Number, required: true },
    orderUrl: { type: String, default: "#" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
