const Product = require("../models/Product");
const User = require("../models/User");
const platformCatalog = require("../data/platformCatalog");
const { detectIntent } = require("../utils/intentDetector");
const { estimateDistanceKm } = require("../utils/distanceService");

const platformRates = {
  Uber: { base: 80, perKm: 14.2, etaFactor: 1.05, url: "https://www.uber.com" },
  Ola: { base: 72, perKm: 13.5, etaFactor: 1.1, url: "https://www.olacabs.com" },
  Rapido: { base: 65, perKm: 12.3, etaFactor: 0.95, url: "https://www.rapido.bike" },
};

const toCategory = (intent) => {
  if (intent === "food") return "Food";
  if (intent === "ride") return "Rides";
  return "Shopping";
};

const buildRideResults = async ({ source, destination }) => {
  if (!source || !destination) {
    return { items: [], distanceKm: null, mapSource: "simulated" };
  }

  const distance = await estimateDistanceKm(source, destination);
  const items = Object.entries(platformRates).map(([platform, formula]) => {
    const surge = 1 + ((distance.distanceKm % 5) * 0.03);
    const price = Math.round((formula.base + distance.distanceKm * formula.perKm) * surge);
    const etaMinutes = Math.max(5, Math.round((distance.distanceKm / 1.6) * formula.etaFactor));

    return {
      intent: "ride",
      name: `Cab from ${source} to ${destination}`,
      platform,
      price,
      rating: Number((4 + (distance.distanceKm % 7) * 0.1).toFixed(1)),
      etaMinutes,
      redirectUrl: formula.url,
      source,
      destination,
      distanceKm: distance.distanceKm,
      mapSource: distance.source,
    };
  });

  return { items, distanceKm: distance.distanceKm, mapSource: distance.source };
};

const matchText = (query, candidate) => {
  const normalizedQuery = query.toLowerCase();
  return candidate.toLowerCase().includes(normalizedQuery);
};

const filterAndSort = (items, { maxPrice, minRating, sortBy = "price" }) => {
  const filtered = items
    .filter((item) => (maxPrice ? item.price <= Number(maxPrice) : true))
    .filter((item) => (minRating ? item.rating >= Number(minRating) : true));

  if (sortBy === "rating") {
    return filtered.sort((a, b) => b.rating - a.rating);
  }
  return filtered.sort((a, b) => a.price - b.price);
};

const queryDbCatalog = async (query, intent) => {
  const category = toCategory(intent);
  const regex = { $regex: query, $options: "i" };
  const products = await Product.find({
    category,
    $or: [{ name: regex }, { platform: regex }],
  }).lean();

  return products.map((item) => ({
    intent,
    name: item.name,
    platform: item.platform,
    price: item.price,
    rating: item.rating,
    etaMinutes: item.deliveryTime,
    redirectUrl: item.orderUrl,
  }));
};

const queryLocalCatalog = (query, intent) => {
  return platformCatalog
    .filter((item) => item.intent === intent)
    .filter((item) => {
      const inName = matchText(query, item.name);
      const inTags = item.tags.some((tag) => matchText(query, tag));
      return inName || inTags;
    });
};

const saveSearchHistory = async (userId, payload) => {
  if (!userId) return;
  await User.findByIdAndUpdate(userId, {
    $push: {
      searchHistory: {
        query: payload.query,
        category: payload.intent,
        createdAt: new Date(),
      },
    },
  });
};

const runIntelligentSearch = async ({ userId, query, source, destination, filters }) => {
  const intent = detectIntent(query);
  let items = [];
  let distanceKm = null;
  let mapSource = null;

  if (intent === "ride") {
    const ride = await buildRideResults({ source, destination });
    items = ride.items;
    distanceKm = ride.distanceKm;
    mapSource = ride.mapSource;
  } else {
    items = await queryDbCatalog(query, intent);
    if (!items.length) {
      items = queryLocalCatalog(query, intent);
    }
  }

  const compared = filterAndSort(items, filters);
  const cheapestPrice = compared.length ? Math.min(...compared.map((item) => item.price)) : null;
  const enriched = compared.map((item) => ({ ...item, isCheapest: item.price === cheapestPrice }));

  await saveSearchHistory(userId, { query, intent });

  return {
    intent,
    query,
    total: enriched.length,
    cheapestPrice,
    distanceKm,
    mapSource,
    results: enriched,
  };
};

const getSuggestions = async (text) => {
  const keyword = text.toLowerCase();

  const localSuggestions = platformCatalog
    .map((item) => item.name)
    .filter((name) => name.toLowerCase().includes(keyword));

  const dbSuggestions = await Product.find({ name: { $regex: text, $options: "i" } })
    .select("name -_id")
    .limit(8)
    .lean();

  const merged = [...localSuggestions, ...dbSuggestions.map((item) => item.name)];
  return [...new Set(merged)].slice(0, 8);
};

module.exports = { runIntelligentSearch, getSuggestions, filterAndSort };
