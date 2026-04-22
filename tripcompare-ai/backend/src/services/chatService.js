const axios = require("axios");

const DEFAULT_SYSTEM_PROMPT =
  "You are TripCompare AI assistant. Help users with travel planning, routes, budgets, destinations, hotels, and practical tips. Keep answers concise and clear.";

const normalizeMessages = (messages = []) => {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((item) => item && typeof item.content === "string" && ["user", "assistant", "system"].includes(item.role))
    .map((item) => ({ role: item.role, content: item.content.trim() }))
    .filter((item) => item.content.length > 0)
    .slice(-10);
};

const generateChatReply = async ({ messages }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return "OpenAI key is not configured on server yet. Please add OPENAI_API_KEY in server .env.";
  }

  const safeMessages = normalizeMessages(messages);
  const payloadMessages = [{ role: "system", content: DEFAULT_SYSTEM_PROMPT }, ...safeMessages];

  try {
    const { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model,
        messages: payloadMessages,
        temperature: 0.6,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return "I could not generate a response right now. Please try again.";
    }

    return reply;
  } catch (error) {
    const status = error?.response?.status;

    if (status === 429) {
      return "OpenAI quota/rate limit reached. Please check billing/usage, then try again.";
    }

    if (status === 401 || status === 403) {
      return "OpenAI API key is invalid or lacks permission. Please update OPENAI_API_KEY.";
    }

    return "AI service is temporarily unavailable. Please try again shortly.";
  }
};

module.exports = {
  generateChatReply,
};
