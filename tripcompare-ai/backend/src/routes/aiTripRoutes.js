const express = require("express");
const { generateTripController } = require("../controllers/tripGenerationController");

const router = express.Router();

router.post("/", generateTripController);

module.exports = router;
