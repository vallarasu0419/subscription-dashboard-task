import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionApi } from '../../api/subscriptionApi.js';
import { paymentApi } from '../../api/paymentApi.js';
import { authApi } from '../../api/authApi.js';
import { loadRazorpay } from '../../utils/loadRazorpay.js';
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

// Free-plan flow: subscribe directly (no payment).
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

// Paid-plan flow: create order -> open Razorpay checkout -> verify -> activate.
export const subscribeWithPayment = createAsyncThunk(
  'subscriptions/subscribeWithPayment',
  async (plan, { rejectWithValue }) => {
    try {
      const ok = await loadRazorpay();
      if (!ok) {
        throw new Error('Failed to load the payment SDK. Check your connection.');
      }

      const order = await paymentApi.createOrder(plan.id);
      // Prefill name/email when available; ignore failure silently.
      const me = await authApi.me().catch(() => ({ user: {} }));

      // Razorpay Checkout reports its result via a callback, so wrap it in a Promise.
      const subscription = await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'SubHub',
          description: `${order.planName} plan`,
          order_id: order.orderId,
          prefill: {
            name: me.user?.name || '',
            email: me.user?.email || '',
          },
          theme: { color: '#0f766e' },
          handler: async (response) => {
            try {
              const sub = await paymentApi.verify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
              });
              resolve(sub);
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
        });
        rzp.open();
      });

      return subscription;
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
      // Free subscribe
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
      // Paid subscribe (Razorpay)
      .addCase(subscribeWithPayment.pending, (state, { meta }) => {
        state.subscribingPlanId = meta.arg.id;
        state.error = null;
      })
      .addCase(subscribeWithPayment.fulfilled, (state, { payload }) => {
        state.subscribingPlanId = null;
        state.current = payload;
      })
      .addCase(subscribeWithPayment.rejected, (state, { payload }) => {
        state.subscribingPlanId = null;
        state.error = payload;
      })
      // Admin list
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