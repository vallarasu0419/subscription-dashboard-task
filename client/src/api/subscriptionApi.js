import axiosClient from './axiosClient.js';

export const subscriptionApi = {
  subscribe: (planId) =>
    axiosClient.post(`/subscribe/${planId}`).then((r) => r.data.data.subscription),

  getMySubscription: () =>
    axiosClient.get('/my-subscription').then((r) => r.data.data.subscription),

  getAllSubscriptions: () =>
    axiosClient.get('/admin/subscriptions').then((r) => r.data.data.subscriptions),
};
