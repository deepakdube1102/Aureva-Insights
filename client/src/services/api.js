import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Clerk token to requests dynamically
export const setAuthToken = (getToken) => {
  api.interceptors.request.use(async (config) => {
    try {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Token not available — continue without auth
    }
    return config;
  });
};

// --- Fund APIs (public, no auth needed) ---

export const searchFunds = async (query) => {
  const { data } = await api.get('/api/funds/search', { params: { q: query } });
  return data;
};

export const getAllFunds = async () => {
  const { data } = await api.get('/api/funds/all');
  return data;
};

export const getFundDetail = async (schemeCode) => {
  const { data } = await api.get(`/api/funds/${schemeCode}`);
  return data;
};

// --- Watchlist APIs (auth required) ---

export const getWatchlist = async () => {
  const { data } = await api.get('/api/watchlist');
  return data;
};

export const addToWatchlist = async (schemeCode, schemeName) => {
  const { data } = await api.post('/api/watchlist', { schemeCode, schemeName });
  return data;
};

export const removeFromWatchlist = async (schemeCode) => {
  const { data } = await api.delete(`/api/watchlist/${schemeCode}`);
  return data;
};

export default api;
