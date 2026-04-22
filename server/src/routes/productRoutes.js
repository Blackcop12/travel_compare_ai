const express = require("express");
const optionalAuth = require("../middleware/optionalAuth");
const { search } = require("../controllers/searchController");

const router = express.Router();

router.get("/search", optionalAuth, (req, res, next) => {
  req.body = {
    query: req.query.query,
    source: req.query.source || "",
    destination: req.query.destination || "",
    filters: {
      maxPrice: req.query.maxPrice,
      minRating: req.query.minRating,
      sortBy: req.query.sortBy || "price",
    },
  };
  return search(req, res, next);
});

module.exports = router;
