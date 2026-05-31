import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import plansReducer from '../features/plans/plansSlice.js';
import subscriptionsReducer from '../features/subscriptions/subscriptionsSlice.js';
import themeReducer from '../features/theme/themeSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    plans: plansReducer,
    subscriptions: subscriptionsReducer,
    theme: themeReducer,
  },
});
