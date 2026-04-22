const express = require("express");
const { calculateTravelCost } = require("../services/travelService");

const router = express.Router();

router.post("/", (req, res, next) => {
  try {
    const { source, destination, travelers = 1 } = req.body;

    if (!source || !destination) {
      return res.status(400).json({ message: "Source and destination are required" });
    }

    const result = calculateTravelCost({
      source,
      destination,
      travelers,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
