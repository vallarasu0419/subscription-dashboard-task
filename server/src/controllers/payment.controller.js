import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { env } from '../config/env.js';
import { createOrder, verifyPaymentSignature } from '../services/payment.service.js';
import { subscribeToPlan } from '../services/subscription.service.js';

// Step 1: create an order for a paid plan.
export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { order, plan } = await createOrder(req.params.planId);
  return sendResponse(res, 201, 'Order created', {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: env.razorpay.keyId, // public key, safe to send to the client
    planName: plan.name,
  });
});

// Step 2: verify payment, then activate the subscription.
export const verifyPayment = asyncHandler(async (req, res) => {
  verifyPaymentSignature(req.body);
  const subscription = await subscribeToPlan(req.user.id, req.body.planId);
  return sendResponse(res, 201, 'Payment verified and subscription activated', {
    subscription,
  });
});