import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import {
  subscribeToPlan,
  getMySubscription,
  getAllSubscriptions,
} from '../services/subscription.service.js';

export const subscribe = asyncHandler(async (req, res) => {
  const subscription = await subscribeToPlan(req.user.id, req.params.planId);
  return sendResponse(res, 201, 'Subscribed successfully', { subscription });
});

export const mySubscription = asyncHandler(async (req, res) => {
  const subscription = await getMySubscription(req.user.id);
  return sendResponse(res, 200, 'Subscription fetched', { subscription });
});

export const allSubscriptions = asyncHandler(async (_req, res) => {
  const subscriptions = await getAllSubscriptions();
  return sendResponse(res, 200, 'Subscriptions fetched', { subscriptions });
});
