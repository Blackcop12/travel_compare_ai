const express = require("express");
const { processAgentQuery } = require("../services/agentService");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Query is required" });
    }

    const result = await processAgentQuery(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
