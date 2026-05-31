import { Router } from 'express';
import authRoutes from './auth.routes.js';
import planRoutes from './plan.routes.js';
import subscriptionRoutes from './subscription.routes.js';
import paymentRoutes from './payment.routes.js';

const router = Router();

router.get('/health', (_req, res) =>
  res.json({ success: true, message: 'API is healthy', uptime: process.uptime() })
);

router.use('/auth', authRoutes);
router.use('/plans', planRoutes);
router.use('/payment', paymentRoutes);
// Subscription routes intentionally mount at /api so paths match the spec exactly.
router.use('/', subscriptionRoutes);

export default router;