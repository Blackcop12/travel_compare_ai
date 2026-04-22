const express = require("express");
const { generateChatReply } = require("../services/chatService");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "messages array is required" });
    }

    const reply = await generateChatReply({ messages });
    return res.json({ reply });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
