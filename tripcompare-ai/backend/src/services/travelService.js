const { cityCoordinates, tollCharges } = require("../data/dummyData");

const normalize = (value = "") => value.trim().toLowerCase();

const haversineDistanceKm = (src, dest) => {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRadians(dest.lat - src.lat);
  const dLon = toRadians(dest.lng - src.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(src.lat)) * Math.cos(toRadians(dest.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadiusKm * c).toFixed(1));
};

const getDistanceKm = (source, destination) => {
  const src = cityCoordinates[normalize(source)];
  const dest = cityCoordinates[normalize(destination)];

  if (!src || !dest) {
    return 220;
  }

  return haversineDistanceKm(src, dest);
};

const getToll = (source, destination) => {
  const key = `${normalize(source)}:${normalize(destination)}`;
  return tollCharges[key] || 180;
};

const calculateTravelCost = ({ source, destination, travelers = 1 }) => {
  const distanceKm = getDistanceKm(source, destination);
  const toll = getToll(source, destination);
  const normalizedTravelers = Math.max(1, Number(travelers) || 1);

  const fuelCost = Math.round((distanceKm / 16) * 105);
  const carCost = fuelCost + toll;
  const busFarePerPerson = Math.round(distanceKm * 0.9 + 120);
  const trainFarePerPerson = Math.round(distanceKm * 0.65 + 95);
  const cabFare = Math.round(distanceKm * 17 + toll + 200);

  const options = [
    {
      mode: "car",
      distanceKm,
      totalCost: carCost,
      breakdown: {
        fuel: fuelCost,
        toll,
      },
    },
    {
      mode: "bus",
      distanceKm,
      totalCost: busFarePerPerson * normalizedTravelers,
      breakdown: {
        ticketPerPerson: busFarePerPerson,
        travelers: normalizedTravelers,
      },
    },
    {
      mode: "train",
      distanceKm,
      totalCost: trainFarePerPerson * normalizedTravelers,
      breakdown: {
        ticketPerPerson: trainFarePerPerson,
        travelers: normalizedTravelers,
      },
    },
    {
      mode: "cab",
      distanceKm,
      totalCost: cabFare,
      breakdown: {
        fare: Math.round(distanceKm * 17),
        toll,
        driverAllowance: 200,
      },
    },
  ];

  const cheapest = options.reduce((best, option) => (option.totalCost < best.totalCost ? option : best), options[0]);

  return {
    source,
    destination,
    distanceKm,
    options,
    cheapest: cheapest.mode,
  };
};

module.exports = {
  calculateTravelCost,
};
