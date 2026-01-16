import { configureStore } from '@reduxjs/toolkit';
import tripsReducer from './tripsSlice'; 
import activitiesReducer from './activitiesSlice';

export const store = configureStore({
  reducer: {
    trips: tripsReducer, // <--- On l'ajoute ici
    activities: activitiesReducer,
  
  },
});