import { Subscription, SUBSCRIPTION_STATUS } from '../models/Subscription.js';
import { Plan } from '../models/Plan.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Subscribe a user to a plan. Any existing active subscription is marked
 * cancelled first so a user always has at most one active plan (upgrade/downgrade).
 */
export const subscribeToPlan = async (userId, planId) => {
  const plan = await Plan.findById(planId);
  if (!plan) {
    throw ApiError.notFound('Plan not found');
  }

  await Subscription.updateMany(
    { user: userId, status: SUBSCRIPTION_STATUS.ACTIVE },
    { status: SUBSCRIPTION_STATUS.CANCELLED }
  );

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.duration);

  const subscription = await Subscription.create({
    user: userId,
    plan: plan.id,
    startDate,
    endDate,
    status: SUBSCRIPTION_STATUS.ACTIVE,
  });

  return subscription.populate('plan');
};

/**
 * Returns the user's current subscription (active or most recent).
 * Lazily marks a lapsed-but-still-active row as expired before returning it.
 */
export const getMySubscription = async (userId) => {
  const subscription = await Subscription.findOne({ user: userId })
    .sort({ createdAt: -1 })
    .populate('plan');

  if (!subscription) {
    return null;
  }

  if (
    subscription.status === SUBSCRIPTION_STATUS.ACTIVE &&
    subscription.endDate <= new Date()
  ) {
    subscription.status = SUBSCRIPTION_STATUS.EXPIRED;
    await subscription.save();
  }

  return subscription;
};

/** Admin: list every subscription with user and plan details. */
export const getAllSubscriptions = () =>
  Subscription.find()
    .sort({ createdAt: -1 })
    .populate('plan')
    .populate('user', 'name email role');
