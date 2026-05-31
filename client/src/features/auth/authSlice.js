import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi.js';
import { setAccessToken, clearAccessToken } from '../../api/axiosClient.js';
import { extractErrorMessage } from '../../utils/error.js';

const initialState = {
  user: null,
  isAuthenticated: false,
  // "loading"   -> a register/login/logout action is in flight
  // "bootstrapping" -> initial silent refresh on app load
  status: 'idle',
  bootstrapping: true,
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.register(payload);
      setAccessToken(data.accessToken);
      return data.user;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.login(payload);
      setAccessToken(data.accessToken);
      return data.user;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

/** Silent refresh used on app load to restore a session from the refresh cookie. */
export const bootstrapAuth = createAsyncThunk(
  'auth/bootstrap',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.refresh();
      setAccessToken(data.accessToken);
      return data.user;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout();
  } finally {
    clearAccessToken();
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Used by the axios interceptor when a refresh ultimately fails.
    forceLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      clearAccessToken();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setAuthenticated = (state, { payload }) => {
      state.user = payload;
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
    };

    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, setAuthenticated)
      .addCase(register.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, setAuthenticated)
      .addCase(login.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      })
      .addCase(bootstrapAuth.pending, (state) => {
        state.bootstrapping = true;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        setAuthenticated(state, action);
        state.bootstrapping = false;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.bootstrapping = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
      });
  },
});

export const { forceLogout, clearAuthError } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
