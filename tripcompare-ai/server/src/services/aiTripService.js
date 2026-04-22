const Location = require("../models/location");
const { getDistanceData, getFoodPlaces, getTouristPlaces } = require("./google");
const { generateAiPlan } = require("./openai");
const { searchFlights } = require("./amadeusService");

const fallbackLocationSeed = [
  {
    city: "goa",
    country: "India",
    bestTime: "November to February",
    places: [
      { name: "Baga Beach", rating: 4.7, image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=900&q=80", address: "North Goa" },
      { name: "Fort Aguada", rating: 4.6, image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80", address: "Candolim, Goa" },
      { name: "Anjuna Beach", rating: 4.5, image: "https://images.unsplash.com/photo-1526481280695-3c469f27f406?auto=format&fit=crop&w=900&q=80", address: "North Goa" },
    ],
    food: [
      { name: "Goan Prawn Curry", rating: 4.6, image: "https://images.unsplash.com/photo-1617692855027-33b14f061079?auto=format&fit=crop&w=900&q=80", address: "Panaji" },
      { name: "Seafood Platter", rating: 4.5, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80", address: "Calangute" },
      { name: "Bebinca", rating: 4.4, image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80", address: "Old Goa" },
    ],
    costs: { parking: "INR 250/day", localTransport: "INR 1200", foodBudget: "INR 1800" },
  },
  {
    city: "manali",
    country: "India",
    bestTime: "October to March",
    places: [
      { name: "Solang Valley", rating: 4.8, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80", address: "Manali" },
      { name: "Rohtang Pass", rating: 4.7, image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80", address: "Himachal Pradesh" },
      { name: "Hadimba Temple", rating: 4.6, image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=900&q=80", address: "Manali" },
    ],
    food: [
      { name: "Siddu", rating: 4.5, image: "https://images.unsplash.com/photo-1604908176997-4318f99d30f3?auto=format&fit=crop&w=900&q=80", address: "Old Manali" },
      { name: "Thukpa", rating: 4.5, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80", address: "Mall Road" },
      { name: "Trout Fish", rating: 4.4, image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=900&q=80", address: "Kullu Valley" },
    ],
    costs: { parking: "INR 220/day", localTransport: "INR 1000", foodBudget: "INR 1600" },
  },
];

let hasSeededLocations = false;

const normalizeCity = (value = "") => value.trim().toLowerCase();

const ensureLocationSeedData = async () => {
  if (hasSeededLocations) {
    return;
  }

  const existingCount = await Location.countDocuments();
  if (existingCount === 0) {
    await Location.insertMany(fallbackLocationSeed);
  }

  hasSeededLocations = true;
};

const buildFallbackTripPlan = ({ from, to, travelDate }) => {
  const travelMonth = travelDate
    ? new Date(travelDate).toLocaleDateString("en-IN", {
        month: "long",
      })
    : "peak season";

  return {
    bestTimeToTravel: `Best travel window is around ${travelMonth}.`,
    duration: "3 days",
    itinerary: [
      `Day 1: Travel from ${from} to ${to}, check in, and evening local market walk.`,
      `Day 2: Full-day sightseeing with top attractions and local cuisine stops.`,
      `Day 3: Leisure morning, shopping, and departure back to ${from}.`,
    ],
  };
};

const buildCosts = ({ budget }) => {
  const budgetValue = Number(budget) || 0;
  const parkingDaily = budgetValue ? Math.max(180, Math.round(budgetValue * 0.04)) : 240;
  const localTransport = budgetValue ? Math.max(900, Math.round(budgetValue * 0.18)) : 1200;
  const foodBudget = budgetValue ? Math.max(1200, Math.round(budgetValue * 0.22)) : 1800;

  return {
    parking: `INR ${parkingDaily}/day`,
    localTransport: `INR ${localTransport}`,
    foodBudget: `INR ${foodBudget}`,
  };
};

const generateTripPlanAI = async ({ from, to, travelDate, budget }) => {
  await ensureLocationSeedData();
  const locationDoc = await Location.findOne({ city: normalizeCity(to) }).lean();

  const googleApiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

  const distanceInfo = await getDistanceData({
    from,
    to,
    googleApiKey,
  });

  const placeResults = await getTouristPlaces({
    city: to,
    googleApiKey,
  });

  const places = placeResults?.length
    ? placeResults
    : locationDoc?.places?.map((item) => ({
        name: item.name,
        rating: item.rating,
        photo: item.image,
        image: item.image,
        address: item.address,
        description: "Popular tourist attraction",
      })) || [];

  const foodResults = await getFoodPlaces({
    city: to,
    googleApiKey,
  });

  const food = foodResults?.length
    ? foodResults
    : locationDoc?.food?.map((item) => ({
        name: item.name,
        rating: item.rating,
        photo: item.image,
        image: item.image,
        address: item.address,
        description: "Popular local food",
      })) || [];

  const flights = await searchFlights({
    from,
    to,
    date: travelDate,
    budget,
    distanceKm: distanceInfo.distanceKm,
    config: {
      baseUrl: process.env.AMADEUS_BASE_URL || "https://test.api.amadeus.com",
      apiKey: process.env.AMADEUS_API_KEY,
      apiSecret: process.env.AMADEUS_API_SECRET,
    },
  });

  const carCostValue = Math.round(distanceInfo.distanceKm * 8);
  const busCostValue = 1500;
  const trainCostValue = 1200;
  const minFlight = flights.length
    ? flights.reduce((best, item) => (item.price < best.price ? item : best), flights[0]).price
    : Math.round(distanceInfo.distanceKm * 6.8 + 2800);

  const transportOptions = [
    {
      mode: "car",
      icon: "🚗",
      label: "Car",
      price: carCostValue,
      duration: distanceInfo.durationText,
      note: `Distance x 8/km`,
    },
    {
      mode: "bus",
      icon: "🚌",
      label: "Bus",
      price: busCostValue,
      duration: `${Math.max(2, Math.round(distanceInfo.durationSeconds / 3600) + 2)}h`,
    },
    {
      mode: "train",
      icon: "🚆",
      label: "Train",
      price: trainCostValue,
      duration: `${Math.max(2, Math.round(distanceInfo.durationSeconds / 3600) + 1)}h`,
    },
    {
      mode: "flight",
      icon: "✈️",
      label: "Flight",
      price: minFlight,
      duration: flights[0]?.duration || "2h 10m",
    },
  ];

  const cheapestMode = transportOptions.reduce((best, item) => (item.price < best.price ? item : best), transportOptions[0]).mode;

  const fallbackTrip = buildFallbackTripPlan({ from, to, travelDate });
  const useOpenAI = String(process.env.USE_OPENAI).toLowerCase() === "true";
  const aiRaw = useOpenAI
    ? await generateAiPlan({ from, to, budget, apiKey: process.env.OPENAI_API_KEY })
    : null;

  const aiPlan = {
    itinerary:
      Array.isArray(aiRaw?.itinerary) && aiRaw.itinerary.length
        ? aiRaw.itinerary
        : fallbackTrip.itinerary,
    bestTime: aiRaw?.bestTime || locationDoc?.bestTime || fallbackTrip.bestTimeToTravel,
    tips:
      Array.isArray(aiRaw?.tips) && aiRaw.tips.length
        ? aiRaw.tips
        : [
            "Book transport and stay in advance for better prices.",
            "Keep one flexible evening for local markets and food trails.",
            "Carry digital and physical copies of travel tickets and IDs.",
          ],
  };

  return {
    distance: {
      distance: distanceInfo.distanceText,
      duration: distanceInfo.durationText,
    },
    transport: {
      car: `₹${Math.round(carCostValue)}`,
      bus: `₹${Math.round(busCostValue)}`,
      train: `₹${Math.round(trainCostValue)}`,
      flight: `₹${Math.round(minFlight)}`,
    },
    transportOptions,
    cheapestMode,
    places,
    food,
    flights,
    aiPlan,
    costs: locationDoc?.costs || buildCosts({ budget }),
    meta: {
      from,
      to,
      travelDate,
      distanceKm: distanceInfo.distanceKm,
      distanceSource: distanceInfo.source,
      usedOpenAI: Boolean(aiRaw),
    },
  };
};

module.exports = {
  generateTripPlanAI,
};
