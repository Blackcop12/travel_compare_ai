const express = require("express");
const Hotel = require("../models/Hotel");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { location, maxPrice } = req.query;
    const filter = {};

    if (location) {
      filter.location = String(location).trim().toLowerCase();
    }

    if (maxPrice) {
      filter.price = { $lte: Number(maxPrice) };
    }

    const hotels = await Hotel.find(filter).sort({ price: 1 }).limit(20);
    res.json({ hotels });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
