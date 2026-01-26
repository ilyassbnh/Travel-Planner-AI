import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const addTrip = createAsyncThunk(
    'trips/addTrip',
    async (newTrip, { rejectWithValue }) => {
        try {
            const response = await api.post('/trips', newTrip);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Erreur création');
        }
    }
);
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

// 3. THUNK: Updates trip budget
export const updateTripBudget = createAsyncThunk(
    'trips/updateTripBudget',
    async ({ id, budget }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/trips/${id}`, { budget });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Erreur mise à jour budget');
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
            })
            // AJOUTER CECI :
            .addCase(addTrip.fulfilled, (state, action) => {
                // On ajoute le nouveau voyage à la liste locale (pas besoin de recharger la page)
                state.list.push(action.payload);
            })
            // Update Budget
            .addCase(updateTripBudget.fulfilled, (state, action) => {
                const index = state.list.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            });
    },
});


export default tripsSlice.reducer;