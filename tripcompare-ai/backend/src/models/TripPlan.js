const mongoose = require("mongoose");

const tripPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    days: { type: Number, required: true },
    travelers: { type: Number, required: true },
    selectedMode: { type: String, required: true },
    totalTripCost: { type: Number, required: true },
    breakdown: {
      travel: { type: Number, required: true },
      stay: { type: Number, required: true },
      food: { type: Number, required: true },
    },
    rawResult: { type: Object, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TripPlan", tripPlanSchema);
