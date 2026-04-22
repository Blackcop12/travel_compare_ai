const express = require("express");
const { compare } = require("../controllers/searchController");

const router = express.Router();

router.post("/", compare);

module.exports = router;
