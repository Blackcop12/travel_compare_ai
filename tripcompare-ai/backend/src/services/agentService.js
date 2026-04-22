const axios = require("axios");
const Hotel = require("../models/Hotel");
const Place = require("../models/Place");
const { foodByLocation } = require("../data/seedData");
const { cityCoordinates } = require("../data/dummyData");
const { calculateTravelCost } = require("./travelService");

const knownCities = ["pune", "mumbai", "goa", "delhi", "jaipur", "bangalore", "chennai", "hyderabad"];

const detectIntent = (query) => {
  const q = query.toLowerCase();

  if (/hotel|stay|room|hostel|resort/.test(q)) {
    return "hotel";
  }

  if (/travel|trip|journey|route|distance|from\s+.*\s+to\s+/.test(q)) {
    return "travel";
  }

  if (/food|eat|restaurant|cafe|meal/.test(q)) {
    return "food";
  }

  if (/near|nearby|around/.test(q)) {
    return "place";
  }

  if (/place|visit|attraction|sightseeing/.test(q)) {
    return "place";
  }

  return "recommendation";
};

const extractBudget = (query) => {
  const matches = query.match(/\b(\d{3,6})\b/g);
  return matches?.length ? Number(matches[0]) : null;
};

const extractLocation = (query) => {
  const lower = query.toLowerCase();
  return knownCities.find((city) => lower.includes(city)) || "pune";
};

const extractNearLocation = (query) => {
  const lower = query.toLowerCase();
  const nearMatch = lower.match(/(?:near|nearby|around)\s+([a-z\s]+)/);

  if (!nearMatch) {
    return null;
  }

  const phrase = nearMatch[1].trim();
  const matched = knownCities.find((city) => phrase.includes(city));
  if (matched) {
    return matched;
  }

  return extractLocation(phrase);
};

const haversineDistanceKm = (src, dest) => {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRadians(dest.lat - src.lat);
  const dLon = toRadians(dest.lng - src.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(src.lat)) * Math.cos(toRadians(dest.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const getNearbyCities = (location, radiusKm = 260) => {
  const origin = cityCoordinates[location];
  if (!origin) {
    return [];
  }

  return Object.entries(cityCoordinates)
    .filter(([city]) => city !== location)
    .map(([city, coord]) => ({ city, distance: haversineDistanceKm(origin, coord) }))
    .filter((item) => item.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .map((item) => item.city);
};

const extractRoute = (query) => {
  const routeMatch = query.toLowerCase().match(/from\s+([a-z\s]+?)\s+to\s+([a-z\s]+)/);

  if (!routeMatch) {
    return { source: "mumbai", destination: "pune" };
  }

  return {
    source: routeMatch[1].trim(),
    destination: routeMatch[2].trim(),
  };
};

const improveMessageWithOpenAI = async ({ query, payload }) => {
  const useOpenAI = String(process.env.USE_OPENAI).toLowerCase() === "true";
  const apiKey = process.env.OPENAI_API_KEY;

  if (!useOpenAI || !apiKey) {
    return payload;
  }

  try {
    const prompt = `User query: ${query}\nIntent: ${payload.intent}\nExtracted: ${JSON.stringify(
      payload.extracted
    )}\nCreate a concise and helpful travel assistant reply in 2 short lines.`;

    const { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 8000,
      }
    );

    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return payload;
    }

    return {
      ...payload,
      message: text,
    };
  } catch (_error) {
    return payload;
  }
};

const getHotels = async ({ location, budget }) => {
  const filter = { location };

  if (budget) {
    filter.price = { $lte: budget };
  }

  return Hotel.find(filter).sort({ price: 1 }).limit(8).lean();
};

const getPlaces = async (location) => Place.find({ location }).limit(6).lean();

const getPlacesNear = async (location) => {
  const nearbyCities = getNearbyCities(location);
  const allLocations = [location, ...nearbyCities];

  const places = await Place.find({ location: { $in: allLocations } }).limit(10).lean();

  return {
    places,
    nearbyCities,
  };
};

const getFoods = (location) => foodByLocation[location] || foodByLocation.pune;

const processAgentQuery = async (query) => {
  const intent = detectIntent(query);
  const nearLocation = extractNearLocation(query);
  const location = nearLocation || extractLocation(query);
  const budget = extractBudget(query);

  if (intent === "hotel") {
    const hotels = await getHotels({ location, budget });
    const payload = {
      intent,
      extracted: { location, budget, category: "hotel" },
      message: hotels.length
        ? `Here are hotel options in ${location} sorted by price.`
        : `No hotels found in ${location} for your budget. Try a higher budget.`,
      results: { hotels },
    };

    return improveMessageWithOpenAI({ query, payload });
  }

  if (intent === "travel") {
    const { source, destination } = extractRoute(query);
    const travel = calculateTravelCost({ source, destination, travelers: 1 });

    const payload = {
      intent,
      extracted: { source, destination, budget, category: "travel" },
      message: `Planned travel from ${source} to ${destination}. Cheapest mode is ${travel.cheapest}.`,
      results: { travel },
    };

    return improveMessageWithOpenAI({ query, payload });
  }

  if (intent === "food") {
    const foods = getFoods(location);
    const payload = {
      intent,
      extracted: { location, budget, category: "food" },
      message: `Top food options in ${location} with average cost estimates.`,
      results: { foods },
    };

    return improveMessageWithOpenAI({ query, payload });
  }

  if (intent === "place") {
    const { places, nearbyCities } = await getPlacesNear(location);

    const nearLabel = nearbyCities.length ? ` and nearby ${nearbyCities.join(", ")}` : "";
    const payload = {
      intent,
      extracted: { location, budget, category: "place", nearbyCities },
      message: `Best places to visit near ${location}${nearLabel}.`,
      results: { places, nearbyCities },
    };

    return improveMessageWithOpenAI({ query, payload });
  }

  const [hotels, places] = await Promise.all([getHotels({ location, budget }), getPlaces(location)]);
  const payload = {
    intent,
    extracted: { location, budget, category: "mixed" },
    message: `Here is a smart starter plan for ${location}: hotels, places, and food picks.`,
    results: {
      hotels,
      places,
      foods: getFoods(location),
    },
  };

  return improveMessageWithOpenAI({ query, payload });
};

module.exports = {
  detectIntent,
  extractBudget,
  extractLocation,
  processAgentQuery,
};
