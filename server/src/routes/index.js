import { Router } from 'express';
import authRoutes from './auth.routes.js';
import planRoutes from './plan.routes.js';
import subscriptionRoutes from './subscription.routes.js';

const router = Router();

router.get('/health', (_req, res) =>
  res.json({ success: true, message: 'API is healthy', uptime: process.uptime() })
);

router.use('/auth', authRoutes);
router.use('/plans', planRoutes);
// Subscription routes intentionally mount at /api so paths match the spec exactly:
//   POST /api/subscribe/:planId, GET /api/my-subscription, GET /api/admin/subscriptions
router.use('/', subscriptionRoutes);

export default router;
