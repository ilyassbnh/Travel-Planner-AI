import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// 1. THUNK : Add Trip
export const addTrip = createAsyncThunk(
    'trips/addTrip',
    async (newTrip, { rejectWithValue }) => {
        try {
            const response = await api.post('/trips', newTrip);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.formattedMessage || error.response?.data || 'Erreur création');
        }
    }
);

// 2. THUNK : Fetch Trips
export const fetchTrips = createAsyncThunk(
    'trips/fetchTrips',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/trips');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.formattedMessage || error.response?.data || 'Erreur chargement');
        }
    }
);

// 3. THUNK: Updates trip details (generic)
export const updateTrip = createAsyncThunk(
    'trips/updateTrip',
    async ({ id, ...updates }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/trips/${id}`, updates);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.formattedMessage || error.response?.data || 'Erreur mise à jour voyage');
        }
    }
);

// 4. THUNK: Delete trip
export const deleteTrip = createAsyncThunk(
    'trips/deleteTrip',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/trips/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.formattedMessage || error.response?.data || 'Erreur suppression voyage');
        }
    }
);

// SLICE
const tripsSlice = createSlice({
    name: 'trips',
    initialState: {
        list: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchTrips.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTrips.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchTrips.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Add
            .addCase(addTrip.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            // Update
            .addCase(updateTrip.fulfilled, (state, action) => {
                const index = state.list.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = { ...state.list[index], ...action.payload };
                }
            })
            // Delete
            .addCase(deleteTrip.fulfilled, (state, action) => {
                state.list = state.list.filter(t => t.id !== action.payload);
            });
    },
});

export default tripsSlice.reducer;