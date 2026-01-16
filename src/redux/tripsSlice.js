import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// 1. THUNK : Action asynchrone pour récupérer les voyages depuis l'API
export const fetchTrips = createAsyncThunk(
  'trips/fetchTrips',
  async (_, { rejectWithValue }) => {
    try {
      // Axios va faire : https://...mockapi.io/trips
      const response = await api.get('/trips');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur chargement');
    }
  }
);

// 2. SLICE : Gestion de l'état (chargement, succès, erreur)
const tripsSlice = createSlice({
  name: 'trips',
  initialState: {
    list: [],        // La liste des voyages
    status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Ici on mettra les actions synchrones (ex: filtrer) plus tard
  },
  extraReducers: (builder) => {
    builder
      // Cas : Chargement en cours
      .addCase(fetchTrips.pending, (state) => {
        state.status = 'loading';
      })
      // Cas : Succès (On a reçu les données)
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload; // On remplit la liste !
      })
      // Cas : Erreur
      .addCase(fetchTrips.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default tripsSlice.reducer;