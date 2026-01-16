import { configureStore } from '@reduxjs/toolkit';
import tripsReducer from './tripsSlice'; // <--- Import ajouté

export const store = configureStore({
  reducer: {
    trips: tripsReducer, // <--- On l'ajoute ici
  },
});