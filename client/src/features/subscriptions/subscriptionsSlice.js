import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionApi } from '../../api/subscriptionApi.js';
import { extractErrorMessage } from '../../utils/error.js';

const initialState = {
  current: null,          // the logged-in user's subscription
  currentStatus: 'idle',
  all: [],                // admin list
  allStatus: 'idle',
  subscribingPlanId: null, // which plan card is mid-subscribe
  error: null,
};

export const fetchMySubscription = createAsyncThunk(
  'subscriptions/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionApi.getMySubscription();
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const subscribe = createAsyncThunk(
  'subscriptions/subscribe',
  async (planId, { rejectWithValue }) => {
    try {
      return await subscriptionApi.subscribe(planId);
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchAllSubscriptions = createAsyncThunk(
  'subscriptions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionApi.getAllSubscriptions();
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    resetSubscriptions: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMySubscription.pending, (state) => {
        state.currentStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchMySubscription.fulfilled, (state, { payload }) => {
        state.currentStatus = 'succeeded';
        state.current = payload;
      })
      .addCase(fetchMySubscription.rejected, (state, { payload }) => {
        state.currentStatus = 'failed';
        state.error = payload;
      })
      .addCase(subscribe.pending, (state, { meta }) => {
        state.subscribingPlanId = meta.arg;
        state.error = null;
      })
      .addCase(subscribe.fulfilled, (state, { payload }) => {
        state.subscribingPlanId = null;
        state.current = payload;
      })
      .addCase(subscribe.rejected, (state, { payload }) => {
        state.subscribingPlanId = null;
        state.error = payload;
      })
      .addCase(fetchAllSubscriptions.pending, (state) => {
        state.allStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchAllSubscriptions.fulfilled, (state, { payload }) => {
        state.allStatus = 'succeeded';
        state.all = payload;
      })
      .addCase(fetchAllSubscriptions.rejected, (state, { payload }) => {
        state.allStatus = 'failed';
        state.error = payload;
      });
  },
});

export const { resetSubscriptions } = subscriptionsSlice.actions;
export const selectSubscriptions = (state) => state.subscriptions;

export default subscriptionsSlice.reducer;
