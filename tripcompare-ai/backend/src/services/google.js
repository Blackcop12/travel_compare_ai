const { getDistanceAndDuration, getPlacesByQuery } = require("./googleTravelService");

const getDistanceData = async ({ from, to, googleApiKey }) => {
  const result = await getDistanceAndDuration({
    from,
    to,
    apiKey: googleApiKey,
  });

  return {
    distanceKm: result.distanceKm,
    distanceText: result.distanceText,
    durationText: result.durationText,
    durationSeconds: result.durationSeconds,
    source: result.source,
  };
};

const getTouristPlaces = async ({ city, googleApiKey }) => {
  return getPlacesByQuery({
    query: `tourist places in ${city}`,
    apiKey: googleApiKey,
    fallbackPrefix: city,
  });
};

const getFoodPlaces = async ({ city, googleApiKey }) => {
  return getPlacesByQuery({
    query: `restaurants in ${city}`,
    apiKey: googleApiKey,
    fallbackPrefix: `${city} food`,
  });
};

module.exports = {
  getDistanceData,
  getTouristPlaces,
  getFoodPlaces,
};
