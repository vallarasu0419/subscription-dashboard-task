import axiosClient from './axiosClient.js';

/** Thin API wrappers — each returns the unwrapped `data` payload. */
export const authApi = {
  register: (payload) =>
    axiosClient.post('/auth/register', payload).then((r) => r.data.data),

  login: (payload) =>
    axiosClient.post('/auth/login', payload).then((r) => r.data.data),

  refresh: () => axiosClient.post('/auth/refresh').then((r) => r.data.data),

  logout: () => axiosClient.post('/auth/logout').then((r) => r.data),

  me: () => axiosClient.get('/auth/me').then((r) => r.data.data),
};
