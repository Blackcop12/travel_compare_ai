const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    platform: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    deliveryTime: { type: Number },
    orderUrl: { type: String },
  },
  { _id: true }
);

const searchHistorySchema = new mongoose.Schema(
  {
    query: { type: String, required: true },
    category: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    searchHistory: [searchHistorySchema],
    wishlist: [wishlistItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
