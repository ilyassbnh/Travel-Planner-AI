// src/services/api.js
import axios from 'axios';

const API_URL = 'https://6969f8f03a2b2151f846b156.mockapi.io';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor (Optionnel mais pro) : Pour loguer les erreurs proprement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API :", error);
    return Promise.reject(error);
  }
);

export default api;