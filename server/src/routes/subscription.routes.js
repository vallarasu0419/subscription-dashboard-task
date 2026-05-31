import { Router } from 'express';
import {
  subscribe,
  mySubscription,
  allSubscriptions,
} from '../controllers/subscription.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { subscribeSchema } from '../validations/subscription.validation.js';

const router = Router();

router.post(
  '/subscribe/:planId',
  authenticate,
  validate(subscribeSchema),
  subscribe
);
router.get('/my-subscription', authenticate, mySubscription);
router.get(
  '/admin/subscriptions',
  authenticate,
  authorize('admin'),
  allSubscriptions
);

export default router;
