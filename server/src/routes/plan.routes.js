import { Router } from 'express';
import { listPlans } from '../controllers/plan.controller.js';

const router = Router();

// Public: anyone can browse plans before signing up.
router.get('/', listPlans);

export default router;
