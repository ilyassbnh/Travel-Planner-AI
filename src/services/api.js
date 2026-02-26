// src/services/api.js
import axios from 'axios';

const API_URL = 'https://6969f8f03a2b2151f846b156.mockapi.io';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour capturer et formater les erreurs réseau ou serveur
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = "Erreur de connexion au serveur.";

    if (error.response) {
      // The request was made and the server responded with a status code
      const status = error.response.status;
      if (status === 429) {
        errorMessage = `Erreur 429 : Trop de requêtes envoyées à MockAPI. Veuillez patienter un instant.`;
      } else if (status === 404) {
        errorMessage = `Erreur 404 : Ressource introuvable sur le serveur.`;
      } else if (status >= 500) {
        errorMessage = `Erreur ${status} : Problème interne du serveur (MockAPI).`;
      } else {
        errorMessage = `Erreur ${status} : La requête a échoué. ${error.response.statusText || ''}`;
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g., offline)
      errorMessage = "Erreur réseau : Aucune réponse du serveur (MockAPI est peut-être hors-ligne ou bloqué).";
    } else {
      // Something happened in setting up the request
      errorMessage = `Erreur lors de la requête : ${error.message}`;
    }

    console.error("Détails de l'erreur API :", error);

    // Attach the friendly message to the error object so the Redux thunks can read it
    error.formattedMessage = errorMessage;
    return Promise.reject(error);
  }
);

export default api;