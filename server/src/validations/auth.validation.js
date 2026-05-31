import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
    email: z.string().trim().email('A valid email is required').toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters').max(128),
    // Role is optional and defaults to "user"; only seeded/admin flows create admins.
    role: z.enum(['admin', 'user']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('A valid email is required').toLowerCase(),
    password: z.string().min(1, 'Password is required'),
  }),
});
