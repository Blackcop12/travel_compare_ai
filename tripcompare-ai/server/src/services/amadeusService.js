const axios = require("axios");

const cityToIata = {
  mumbai: "BOM",
  pune: "PNQ",
  goa: "GOI",
  delhi: "DEL",
  jaipur: "JAI",
  bangalore: "BLR",
  chennai: "MAA",
  hyderabad: "HYD",
  manali: "KUU",
  dubai: "DXB",
  maldives: "MLE",
  bali: "DPS",
  paris: "CDG",
};

let tokenCache = {
  accessToken: null,
  expiresAt: 0,
};

const normalizeCity = (value = "") => value.trim().toLowerCase();

const parseDuration = (isoDuration = "") => {
  const hourMatch = isoDuration.match(/(\d+)H/);
  const minuteMatch = isoDuration.match(/(\d+)M/);
  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
  return `${hours}h ${minutes}m`;
};

const getMockFlights = ({ from, to, date, distanceKm }) => {
  const basePrice = Math.max(3200, Math.round(distanceKm * 6.4));
  const baseDurationMinutes = Math.max(70, Math.round((distanceKm / 640) * 60));

  return [
    {
      airline: "SkyJet",
      price: basePrice,
      duration: `${Math.floor(baseDurationMinutes / 60)}h ${baseDurationMinutes % 60}m`,
      departure: `${date}T07:30:00`,
      arrival: `${date}T09:10:00`,
      source: "mock",
    },
    {
      airline: "AeroConnect",
      price: basePrice + 1100,
      duration: `${Math.floor((baseDurationMinutes + 35) / 60)}h ${(baseDurationMinutes + 35) % 60}m`,
      departure: `${date}T12:20:00`,
      arrival: `${date}T14:35:00`,
      source: "mock",
    },
    {
      airline: "CloudAir",
      price: basePrice + 1900,
      duration: `${Math.floor((baseDurationMinutes + 60) / 60)}h ${(baseDurationMinutes + 60) % 60}m`,
      departure: `${date}T18:15:00`,
      arrival: `${date}T20:55:00`,
      source: "mock",
    },
  ];
};

const getAccessToken = async ({ baseUrl, apiKey, apiSecret }) => {
  const now = Date.now();
  if (tokenCache.accessToken && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.accessToken;
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", apiKey);
  params.append("client_secret", apiSecret);

  const { data } = await axios.post(`${baseUrl}/v1/security/oauth2/token`, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    timeout: 10000,
  });

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + Number(data.expires_in || 1700) * 1000,
  };

  return tokenCache.accessToken;
};

const searchFlights = async ({ from, to, date, budget, distanceKm, config }) => {
  const origin = cityToIata[normalizeCity(from)];
  const destination = cityToIata[normalizeCity(to)];

  if (!origin || !destination || !config.apiKey || !config.apiSecret) {
    return getMockFlights({ from, to, date, distanceKm });
  }

  try {
    const token = await getAccessToken({
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
    });

    const params = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: date,
      adults: 1,
      max: 5,
      currencyCode: "INR",
    };

    if (budget) {
      params.maxPrice = Number(budget);
    }

    const { data } = await axios.get(`${config.baseUrl}/v2/shopping/flight-offers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
      timeout: 12000,
    });

    const offers = Array.isArray(data?.data) ? data.data : [];
    if (!offers.length) {
      return getMockFlights({ from, to, date, distanceKm });
    }

    return offers.slice(0, 5).map((offer) => {
      const firstSegment = offer?.itineraries?.[0]?.segments?.[0];
      const itinerary = offer?.itineraries?.[0];
      return {
        airline: firstSegment?.carrierCode || "Airline",
        price: Math.round(Number(offer?.price?.grandTotal || 0)),
        duration: parseDuration(itinerary?.duration || ""),
        departure: firstSegment?.departure?.at || date,
        arrival: offer?.itineraries?.[0]?.segments?.slice(-1)?.[0]?.arrival?.at || date,
        source: "amadeus",
      };
    });
  } catch (error) {
    return getMockFlights({ from, to, date, distanceKm });
  }
};

module.exports = {
  searchFlights,
};
