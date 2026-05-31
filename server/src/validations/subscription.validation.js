import { z } from 'zod';

// Mongo ObjectId is a 24-character hex string.
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid plan id');

export const subscribeSchema = z.object({
  params: z.object({
    planId: objectId,
  }),
});
