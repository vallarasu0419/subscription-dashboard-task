import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { planApi } from '../../api/planApi.js';
import { extractErrorMessage } from '../../utils/error.js';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchPlans = createAsyncThunk(
  'plans/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await planApi.getPlans();
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.items = payload;
      })
      .addCase(fetchPlans.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      });
  },
});

export const selectPlans = (state) => state.plans;

export default plansSlice.reducer;
