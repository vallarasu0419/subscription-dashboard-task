import axios from 'axios';

/**
 * Central Axios instance.
 *
 * Security model:
 *  - The short-lived access token lives only in memory (set via setAccessToken).
 *  - The long-lived refresh token lives in an httpOnly cookie managed by the server.
 *  - On a 401 the response interceptor silently refreshes the access token once,
 *    queues any concurrent requests, then replays them.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send/receive the refresh cookie
  headers: { 'Content-Type': 'application/json' },
});

// In-memory access token (never persisted to localStorage).
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;
export const clearAccessToken = () => {
  accessToken = null;
};

// Attach the access token to every outgoing request.
axiosClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// --- Refresh handling ---------------------------------------------------
let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

/**
 * Optional hook so the auth layer can react to an unrecoverable session loss
 * (e.g. dispatch a logout). Set via setOnAuthFailure.
 */
let onAuthFailure = null;
export const setOnAuthFailure = (handler) => {
  onAuthFailure = handler;
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // Never try to refresh the refresh call itself, or non-401s.
    const isRefreshCall = original?.url?.includes('/auth/refresh');

    if (status === 401 && !original._retry && !isRefreshCall) {
      if (isRefreshing) {
        // Wait for the in-flight refresh, then replay this request.
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return axiosClient(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosClient.post('/auth/refresh');
        const newToken = data?.data?.accessToken;
        setAccessToken(newToken);
        flushQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(original);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        clearAccessToken();
        if (onAuthFailure) onAuthFailure();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
