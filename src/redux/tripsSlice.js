import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../services/supabaseClient';

const mapToDB = (trip) => {
    const data = { ...trip };
    if (data.startDate) { data.start_date = data.startDate; delete data.startDate; }
    if (data.endDate) { data.end_date = data.endDate; delete data.endDate; }
    if (data.coverImage) { data.cover_image = data.coverImage; delete data.coverImage; }
    return data;
};

const mapFromDB = (row) => {
    const data = { ...row };
    if (data.start_date) { data.startDate = data.start_date; delete data.start_date; }
    if (data.end_date) { data.endDate = data.end_date; delete data.end_date; }
    if (data.cover_image) { data.coverImage = data.cover_image; delete data.cover_image; }
    return data;
};

// 1. THUNK : Add Trip
export const addTrip = createAsyncThunk(
    'trips/addTrip',
    async (newTrip, { rejectWithValue }) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Vous devez être connecté pour ajouter un voyage.");

            const dbPayload = mapToDB(newTrip);
            dbPayload.user_id = user.id;

            const { data, error } = await supabase
                .from('trips')
                .insert([dbPayload])
                .select();

            if (error) throw error;
            return mapFromDB(data[0]);
        } catch (error) {
            return rejectWithValue(error.message || 'Erreur création');
        }
    }
);

// 2. THUNK : Fetch Trips
export const fetchTrips = createAsyncThunk(
    'trips/fetchTrips',
    async (_, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data.map(mapFromDB);
        } catch (error) {
            return rejectWithValue(error.message || 'Erreur chargement');
        }
    }
);

// 3. THUNK: Updates trip details (generic)
export const updateTrip = createAsyncThunk(
    'trips/updateTrip',
    async ({ id, ...updates }, { rejectWithValue }) => {
        try {
            const dbPayload = mapToDB(updates);

            const { data, error } = await supabase
                .from('trips')
                .update(dbPayload)
                .eq('id', id)
                .select();

            if (error) throw error;
            return mapFromDB(data[0]);
        } catch (error) {
            return rejectWithValue(error.message || 'Erreur mise à jour voyage');
        }
    }
);

// 4. THUNK: Delete trip
export const deleteTrip = createAsyncThunk(
    'trips/deleteTrip',
    async (id, { rejectWithValue }) => {
        try {
            const { error } = await supabase
                .from('trips')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return id;
        } catch (error) {
            return rejectWithValue(error.message || 'Erreur suppression voyage');
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