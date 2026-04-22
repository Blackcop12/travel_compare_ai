const axios = require("axios");
const { cityCoordinates, tollCharges, destinationCatalog } = require("../data/dummyData");

const normalizeCity = (city) => city.trim().toLowerCase();

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

const fetchDistanceFromGoogle = async (source, destination, apiKey) => {
  if (!apiKey) {
    return null;
  }

  try {
    const { data } = await axios.get("https://maps.googleapis.com/maps/api/distancematrix/json", {
      params: {
        origins: source,
        destinations: destination,
        units: "metric",
        key: apiKey,
      },
      timeout: 8000,
    });

    if (data.status !== "OK") {
      return null;
    }

    const element = data?.rows?.[0]?.elements?.[0];
    if (!element || element.status !== "OK") {
      return null;
    }

    return Number((element.distance.value / 1000).toFixed(1));
  } catch (error) {
    return null;
  }
};

const getDistance = async (source, destination, apiKey) => {
  const sourceKey = normalizeCity(source);
  const destinationKey = normalizeCity(destination);

  const googleDistance = await fetchDistanceFromGoogle(source, destination, apiKey);
  if (googleDistance) {
    return { distanceKm: googleDistance, source: "google-maps" };
  }

  const sourceCoord = cityCoordinates[sourceKey];
  const destinationCoord = cityCoordinates[destinationKey];

  if (!sourceCoord || !destinationCoord) {
    return { distanceKm: 250, source: "fallback-default" };
  }

  const mappedDistance = haversineDistanceKm(sourceCoord, destinationCoord);
  return {
    distanceKm: Number(mappedDistance.toFixed(1)),
    source: "haversine-fallback",
  };
};

const getToll = (source, destination) => {
  const key = `${normalizeCity(source)}:${normalizeCity(destination)}`;
  return tollCharges[key] || 200;
};

const routeWaypoints = {
  "pune:mumbai": ["Kamshet", "Lonavala", "Karjat"],
  "mumbai:pune": ["Karjat", "Lonavala", "Kamshet"],
  "bangalore:chennai": ["Hosur", "Krishnagiri", "Vellore"],
  "chennai:bangalore": ["Vellore", "Krishnagiri", "Hosur"],
  "delhi:jaipur": ["Gurugram", "Neemrana", "Shahpura"],
  "jaipur:delhi": ["Shahpura", "Neemrana", "Gurugram"],
};

const getViaStops = (source, destination) => {
  const key = `${normalizeCity(source)}:${normalizeCity(destination)}`;
  return routeWaypoints[key] || [];
};

const getTravelOptions = (distanceKm, travelers, tollCharge) => {
  const fuelPricePerLitre = 105;
  const mileageKmPerLitre = 16;

  const carFuelCost = (distanceKm / mileageKmPerLitre) * fuelPricePerLitre;
  const carTotal = carFuelCost + tollCharge + 150;

  const busFarePerPerson = distanceKm * 0.85 + 120;
  const trainFarePerPerson = distanceKm * 0.6 + 90;
  const cabBaseFare = distanceKm * 18 + tollCharge + 120;

  const options = [
    {
      mode: "car",
      title: "Self Drive Car",
      durationMinutes: Math.round((distanceKm / 62) * 60),
      totalCost: Math.round(carTotal),
      costBreakdown: {
        fuel: Math.round(carFuelCost),
        toll: tollCharge,
        parkingAndMisc: 150,
      },
    },
    {
      mode: "bus",
      title: "Intercity Bus",
      durationMinutes: Math.round((distanceKm / 52) * 60),
      totalCost: Math.round(busFarePerPerson * travelers),
      costBreakdown: {
        ticket: Math.round(busFarePerPerson),
        travelers,
      },
    },
    {
      mode: "train",
      title: "Express Train",
      durationMinutes: Math.round((distanceKm / 75) * 60),
      totalCost: Math.round(trainFarePerPerson * travelers),
      costBreakdown: {
        ticket: Math.round(trainFarePerPerson),
        travelers,
      },
    },
    {
      mode: "cab",
      title: "Outstation Cab",
      durationMinutes: Math.round((distanceKm / 58) * 60),
      totalCost: Math.round(cabBaseFare),
      costBreakdown: {
        fare: Math.round(distanceKm * 18),
        toll: tollCharge,
        driverAllowance: 120,
      },
    },
  ];

  const cheapest = options.reduce((acc, item) => (item.totalCost < acc.totalCost ? item : acc), options[0]);
  const fastest = options.reduce((acc, item) => (item.durationMinutes < acc.durationMinutes ? item : acc), options[0]);

  return {
    options,
    best: {
      cheapest: cheapest.mode,
      fastest: fastest.mode,
    },
  };
};

const average = (numbers) => numbers.reduce((sum, n) => sum + n, 0) / numbers.length;

const getCitySeed = (city) =>
  city
    .toLowerCase()
    .split("")
    .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

const buildGenericSuggestions = (destination) => {
  const city = destination.trim();
  const seed = getCitySeed(city);
  const base = 1100 + (seed % 700);

  return {
    places: [`${city} Central Square`, `${city} Lake View`, `${city} Heritage Walk`, `${city} City Museum`],
    foods: [
      { name: `${city} Street Combo`, avgCostPerMeal: 130 + (seed % 60) },
      { name: `${city} Local Thali`, avgCostPerMeal: 220 + (seed % 90) },
      { name: `${city} Signature Dinner`, avgCostPerMeal: 360 + (seed % 120) },
    ],
    hotels: [
      { name: `${city} Budget Stay`, priceRangePerNight: [base, base + 900] },
      { name: `${city} Business Hotel`, priceRangePerNight: [base + 1600, base + 3500] },
      { name: `${city} Premium Suites`, priceRangePerNight: [base + 5200, base + 10200] },
    ],
  };
};

const getSuggestions = (destination) => {
  const destinationKey = normalizeCity(destination);
  return destinationCatalog[destinationKey] || buildGenericSuggestions(destination);
};

const buildCostDashboard = ({ options, selectedMode, suggestions, days, travelers }) => {
  const selected = options.find((item) => item.mode === selectedMode) || options[0];

  const stayNights = Math.max(1, days - 1);
  const hotelMidPrices = suggestions.hotels.map((hotel) => average(hotel.priceRangePerNight));
  const avgHotelPerNight = average(hotelMidPrices);

  const avgFoodPerMeal = average(suggestions.foods.map((food) => food.avgCostPerMeal));
  const mealsPerDay = 3;

  const stayCost = Math.round(avgHotelPerNight * stayNights);
  const foodCost = Math.round(avgFoodPerMeal * mealsPerDay * days * travelers);
  const travelCost = selected.totalCost;

  return {
    selectedTravelMode: selected.mode,
    totalTripCost: travelCost + stayCost + foodCost,
    breakdown: {
      travel: travelCost,
      stay: stayCost,
      food: foodCost,
    },
  };
};

const buildItinerary = ({ days, source, destination, suggestions, viaStops }) => {
  const itinerary = [];

  for (let day = 1; day <= days; day += 1) {
    const place1 = suggestions.places[(day - 1) % suggestions.places.length];
    const place2 = suggestions.places[day % suggestions.places.length];
    const lunch = suggestions.foods[(day - 1) % suggestions.foods.length];
    const dinner = suggestions.foods[day % suggestions.foods.length];

    const schedule = [
      `Morning: Visit ${place1}`,
      `Afternoon: Try ${lunch.name} (approx INR ${lunch.avgCostPerMeal})`,
      `Evening: Explore ${place2}`,
      `Dinner: ${dinner.name} (approx INR ${dinner.avgCostPerMeal})`,
    ];

    if (day === 1 && viaStops.length) {
      schedule.unshift(`Route stops: ${viaStops.join(" -> ")}`);
    }

    itinerary.push({
      day,
      title: day === 1 ? `Travel from ${source} to ${destination}` : `Explore ${destination}`,
      schedule,
    });
  }

  return itinerary;
};

const generateTripPlan = async ({ source, destination, days, travelers, selectedMode, googleApiKey }) => {
  const distance = await getDistance(source, destination, googleApiKey);
  const tollCharge = getToll(source, destination);
  const viaStops = getViaStops(source, destination);
  const travel = getTravelOptions(distance.distanceKm, travelers, tollCharge);
  const suggestions = getSuggestions(destination);

  const dashboard = buildCostDashboard({
    options: travel.options,
    selectedMode: selectedMode || travel.best.cheapest,
    suggestions,
    days,
    travelers,
  });

  const itinerary = buildItinerary({
    days,
    source,
    destination,
    suggestions,
    viaStops,
  });

  return {
    route: {
      source,
      destination,
      viaStops,
      distanceKm: distance.distanceKm,
      distanceSource: distance.source,
    },
    travel: {
      options: travel.options,
      bestOption: travel.best,
    },
    suggestions,
    dashboard,
    itinerary,
  };
};

module.exports = {
  generateTripPlan,
};
