import axiosClient from './axiosClient.js';

export const planApi = {
  getPlans: () => axiosClient.get('/plans').then((r) => r.data.data.plans),
};
