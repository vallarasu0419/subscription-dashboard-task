import axiosClient from './axiosClient.js';

export const paymentApi = {
  createOrder: (planId) =>
    axiosClient.post(`/payment/order/${planId}`).then((r) => r.data.data),

  verify: (payload) =>
    axiosClient.post('/payment/verify', payload).then((r) => r.data.data.subscription),
};