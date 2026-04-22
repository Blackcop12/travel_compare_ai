import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const fetchSuggestions = async (q) => {
  const { data } = await api.get("/api/search/suggestions", { params: { q } });
  return data.suggestions || [];
};

export const intelligentSearch = async (payload) => {
  const { data } = await api.post("/api/search", payload);
  return data;
};

export const compareItems = async (payload) => {
  const { data } = await api.post("/api/search/compare", payload);
  return data;
};
