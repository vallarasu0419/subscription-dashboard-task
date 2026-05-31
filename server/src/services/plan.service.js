import { Plan } from '../models/Plan.js';

/** Returns all plans ordered by price ascending. */
export const getAllPlans = () => Plan.find().sort({ price: 1 });

export const getPlanById = (planId) => Plan.findById(planId);
