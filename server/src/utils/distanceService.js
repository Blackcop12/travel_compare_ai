const axios = require("axios");

const normalizeDistanceText = (text) => {
  if (!text) return null;
  const match = text.toLowerCase().match(/([\d.]+)\s*km/);
  if (!match) return null;
  return Number(match[1]);
};

const deterministicDistance = (source, destination) => {
  const key = `${source}-${destination}`.toLowerCase();
  const score = [...key].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return Math.max(3, Math.min(220, Math.round((score % 180) + 12)));
};

const estimateDistanceKm = async (source, destination) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (apiKey) {
    try {
      const encodedSource = encodeURIComponent(source);
      const encodedDestination = encodeURIComponent(destination);
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodedSource}&destinations=${encodedDestination}&key=${apiKey}`;
      const { data } = await axios.get(url, { timeout: 5000 });
      const element = data?.rows?.[0]?.elements?.[0];
      if (element?.status === "OK") {
        const parsed = normalizeDistanceText(element.distance?.text);
        if (parsed) {
          return { distanceKm: parsed, source: "google-maps" };
        }
      }
    } catch (_error) {
      // Fall back to deterministic simulation when API fails.
    }
  }

  return { distanceKm: deterministicDistance(source, destination), source: "simulated" };
};

module.exports = { estimateDistanceKm };
