const axios = require("axios");

const parseJsonSafely = (text = "") => {
  if (!text) {
    return null;
  }

  const normalized = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(normalized);
  } catch (_error) {
    return null;
  }
};

const generateAiPlan = async ({ from, to, budget, apiKey }) => {
  if (!apiKey) {
    return null;
  }

  const prompt = `Create a 3-day travel plan from ${from} to ${to} under INR ${
    budget || "flexible"
  }. Include itinerary, best time, places, food, and tips. Return JSON format with keys: bestTime, itinerary (array), tips (array).`;

  try {
    const { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const content = data?.choices?.[0]?.message?.content;
    return parseJsonSafely(content);
  } catch (_error) {
    return null;
  }
};

module.exports = {
  generateAiPlan,
};
