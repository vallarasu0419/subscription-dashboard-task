import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDatabase } from '../config/db.js';
import { Plan } from '../models/Plan.js';
import { User } from '../models/User.js';
import { Subscription } from '../models/Subscription.js';
import { logger } from '../utils/logger.js';

const plans = [
  {
    name: 'Starter',
    price: 0,
    duration: 30,
    features: [
      '1 team member',
      '5 projects',
      'Community support',
      'Basic analytics',
    ],
  },
  {
    name: 'Pro',
    price: 19,
    duration: 30,
    features: [
      'Up to 10 team members',
      'Unlimited projects',
      'Priority email support',
      'Advanced analytics',
      'Custom integrations',
    ],
  },
  {
    name: 'Business',
    price: 49,
    duration: 30,
    features: [
      'Up to 50 team members',
      'Unlimited projects',
      '24/7 chat support',
      'Advanced analytics + exports',
      'SSO & audit logs',
    ],
  },
  {
    name: 'Enterprise',
    price: 129,
    duration: 365,
    features: [
      'Unlimited team members',
      'Dedicated account manager',
      'Custom SLAs',
      'On-premise option',
      'Premium onboarding',
    ],
  },
];

const demoUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    name: 'Demo User',
    email: 'user@example.com',
    password: 'User@123',
    role: 'user',
  },
];

const seed = async () => {
  try {
    await connectDatabase();

    logger.info('Clearing existing data...');
    await Promise.all([
      Plan.deleteMany({}),
      User.deleteMany({}),
      Subscription.deleteMany({}),
    ]);

    logger.info('Seeding plans...');
    await Plan.insertMany(plans);

    logger.info('Seeding users...');
    // Use create() (not insertMany) so the password-hashing pre-save hook runs.
    await Promise.all(demoUsers.map((user) => User.create(user)));

    logger.info('Seeding complete.');
    logger.info('Demo admin -> admin@example.com / Admin@123');
    logger.info('Demo user  -> user@example.com / User@123');
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    logger.info(`Disconnected from ${env.nodeEnv} database`);
  }
};

seed();
