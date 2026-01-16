// src/redux/activitiesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// 1. THUNK : Récupérer les activités d'un voyage spécifique
// On passe le tripId en paramètre
export const fetchActivities = createAsyncThunk(
  'activities/fetchActivities',
  async (tripId, { rejectWithValue }) => {
    try {
      // MockAPI permet de filtrer avec ?tripId=...
      const response = await api.get(`/activities?tripId=${tripId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur chargement activités');
    }
  }
);

// 2. THUNK : Ajouter une activité (On en aura besoin juste après)
export const addActivity = createAsyncThunk(
  'activities/addActivity',
  async (newActivity, { rejectWithValue }) => {
    try {
      const response = await api.post('/activities', newActivity);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur ajout');
    }
  }
);

const activitiesSlice = createSlice({
  name: 'activities',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cases
      .addCase(fetchActivities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add Cases (Quand on ajoute une activité, on la pousse direct dans la liste)
      .addCase(addActivity.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default activitiesSlice.reducer;