const express = require("express");
const TripPlan = require("../models/TripPlan");
const authMiddleware = require("../middleware/authMiddleware");
const { generateTripPlan } = require("../services/tripPlannerService");

const router = express.Router();

router.post("/plan", authMiddleware, async (req, res, next) => {
  try {
    const { source, destination, days = 3, travelers = 2, selectedMode } = req.body;

    if (!source || !destination) {
      return res.status(400).json({ message: "Source and destination are required" });
    }

    const normalizedDays = Math.min(Math.max(Number(days), 1), 14);
    const normalizedTravelers = Math.min(Math.max(Number(travelers), 1), 10);

    const result = await generateTripPlan({
      source,
      destination,
      days: normalizedDays,
      travelers: normalizedTravelers,
      selectedMode,
      googleApiKey: process.env.GOOGLE_MAPS_API_KEY,
    });

    const selectedModeFinal = result.dashboard.selectedTravelMode;

    const savedPlan = await TripPlan.create({
      userId: req.user.id,
      source,
      destination,
      days: normalizedDays,
      travelers: normalizedTravelers,
      selectedMode: selectedModeFinal,
      totalTripCost: result.dashboard.totalTripCost,
      breakdown: result.dashboard.breakdown,
      rawResult: result,
    });

    res.json({
      planId: savedPlan._id,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/history", authMiddleware, async (req, res, next) => {
  try {
    const trips = await TripPlan.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ trips });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
