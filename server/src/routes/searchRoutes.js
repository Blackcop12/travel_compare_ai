const express = require("express");
const optionalAuth = require("../middleware/optionalAuth");
const { search, compare, suggestions } = require("../controllers/searchController");

const router = express.Router();

router.get("/suggestions", suggestions);
router.post("/", optionalAuth, search);
router.post("/compare", compare);

module.exports = router;
