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

// 3. THUNK : Supprimer une activité
export const deleteActivity = createAsyncThunk(
  'activities/deleteActivity',
  async (activityId, { rejectWithValue }) => {
    try {
      await api.delete(`/activities/${activityId}`);
      return activityId; // On retourne l'ID pour le supprimer du state local
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur suppression');
    }
  }
);

// 4. THUNK : Mettre à jour une activité
export const updateActivity = createAsyncThunk(
  'activities/updateActivity',
  async (activity, { rejectWithValue }) => {
    try {
      const response = await api.put(`/activities/${activity.id}`, activity);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Erreur mise à jour');
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
      // Add Cases
      .addCase(addActivity.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Delete Cases
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.list = state.list.filter(act => act.id !== action.payload);
      })
      // Update Cases
      .addCase(updateActivity.fulfilled, (state, action) => {
        const index = state.list.findIndex(act => act.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default activitiesSlice.reducer;