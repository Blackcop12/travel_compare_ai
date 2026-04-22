const axios = require("axios");
const { cityCoordinates } = require("../data/dummyData");

const normalizeCity = (value = "") => value.trim().toLowerCase();

const fallbackImages = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=900&q=80",
];

const toRadians = (value) => (value * Math.PI) / 180;

const haversineDistanceKm = (src, dest) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(dest.lat - src.lat);
  const dLon = toRadians(dest.lng - src.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(src.lat)) * Math.cos(toRadians(dest.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const fallbackDistance = (from, to) => {
  const fromCoord = cityCoordinates[normalizeCity(from)];
  const toCoord = cityCoordinates[normalizeCity(to)];
  const distanceKm = fromCoord && toCoord ? Math.max(45, Math.round(haversineDistanceKm(fromCoord, toCoord))) : 420;
  const durationHours = Math.max(2, Math.round((distanceKm / 58) * 10) / 10);

  return {
    distanceKm,
    distanceText: `${distanceKm} km`,
    durationText: `${durationHours} hours`,
    durationSeconds: Math.round(durationHours * 3600),
    source: "fallback",
  };
};

const getDistanceAndDuration = async ({ from, to, apiKey }) => {
  if (!apiKey) {
    return fallbackDistance(from, to);
  }

  try {
    const { data } = await axios.get("https://maps.googleapis.com/maps/api/distancematrix/json", {
      params: {
        origins: from,
        destinations: to,
        units: "metric",
        key: apiKey,
      },
      timeout: 9000,
    });

    const element = data?.rows?.[0]?.elements?.[0];
    if (data?.status !== "OK" || !element || element?.status !== "OK") {
      return fallbackDistance(from, to);
    }

    return {
      distanceKm: Number((element.distance.value / 1000).toFixed(1)),
      distanceText: element.distance.text,
      durationText: element.duration.text,
      durationSeconds: element.duration.value,
      source: "google-distance-matrix",
    };
  } catch (error) {
    return fallbackDistance(from, to);
  }
};

const mapPlaceResult = (item, index, apiKey) => {
  const photoRef = item?.photos?.[0]?.photo_reference;
  const photo = photoRef
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=900&photo_reference=${photoRef}&key=${apiKey}`
    : fallbackImages[index % fallbackImages.length];

  return {
    name: item?.name || "Popular Spot",
    rating: Number(item?.rating || 4.3),
    photo,
    image: photo,
    address: item?.formatted_address || item?.vicinity || "Address unavailable",
    description: item?.types?.slice(0, 2)?.join(", ") || "Highly recommended location",
  };
};

const getPlacesByQuery = async ({ query, apiKey, fallbackPrefix }) => {
  if (!apiKey) {
    return [1, 2, 3].map((index) => ({
      name: `${fallbackPrefix} Spot ${index}`,
      rating: 4.2 + index * 0.1,
      photo: fallbackImages[(index - 1) % fallbackImages.length],
      image: fallbackImages[(index - 1) % fallbackImages.length],
      address: `${fallbackPrefix} city center`,
      description: "Popular local attraction",
    }));
  }

  try {
    const { data } = await axios.get("https://maps.googleapis.com/maps/api/place/textsearch/json", {
      params: {
        query,
        key: apiKey,
      },
      timeout: 9000,
    });

    const results = Array.isArray(data?.results) ? data.results.slice(0, 6) : [];
    if (!results.length) {
      return [1, 2, 3].map((index) => ({
        name: `${fallbackPrefix} Spot ${index}`,
        rating: 4.2 + index * 0.1,
        photo: fallbackImages[(index - 1) % fallbackImages.length],
        image: fallbackImages[(index - 1) % fallbackImages.length],
        address: `${fallbackPrefix} city center`,
        description: "Popular local attraction",
      }));
    }

    return results.map((item, index) => mapPlaceResult(item, index, apiKey));
  } catch (error) {
    return [1, 2, 3].map((index) => ({
      name: `${fallbackPrefix} Spot ${index}`,
      rating: 4.2 + index * 0.1,
      photo: fallbackImages[(index - 1) % fallbackImages.length],
      image: fallbackImages[(index - 1) % fallbackImages.length],
      address: `${fallbackPrefix} city center`,
      description: "Popular local attraction",
    }));
  }
};

module.exports = {
  getDistanceAndDuration,
  getPlacesByQuery,
};
