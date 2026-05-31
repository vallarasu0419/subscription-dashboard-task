import crypto from "crypto";
import Razorpay from "razorpay";
import { env } from "../config/env.js";
import { Plan } from "../models/Plan.js";
import { ApiError } from "../utils/ApiError.js";

// Single shared Razorpay client (test keys come from env).
const razorpay = new Razorpay({
  key_id: env.razorpay.keyId,
  key_secret: env.razorpay.keySecret,
});

/**
 * Create a Razorpay order for a paid plan.
 * Amount is in the smallest currency unit (paise), so price * 100.
 */
export const createOrder = async (planId) => {
  const plan = await Plan.findById(planId);
  if (!plan) {
    throw ApiError.notFound("Plan not found");
  }
  if (plan.price <= 0) {
    throw ApiError.badRequest("This plan is free and does not require payment");
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(plan.price * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${plan.id.slice(-6)}`,
      notes: { planId: plan.id, planName: plan.name },
    });
    return { order, plan };
  } catch (err) {
    // Temporary: surface the real Razorpay error in the terminal.
    console.error(
      "RAZORPAY ORDER ERROR >>>",
      JSON.stringify(err?.error || err, null, 2),
    );
    throw err;
  }
};

/**
 * Verify the Razorpay signature to confirm the payment is genuine.
 * Razorpay signs (order_id + "|" + payment_id) with your key secret (HMAC SHA256).
 * We recompute it and compare — if it matches, the payment is trusted.
 */
export const verifyPaymentSignature = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const expected = crypto
    .createHmac("sha256", env.razorpay.keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    throw ApiError.badRequest("Payment verification failed");
  }
  return true;
};
