import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

/**
 * Establish a single shared Mongoose connection.
 * Mongoose buffers queries until the connection is ready, so callers
 * never need to await this beyond application bootstrap.
 */
export const connectDatabase = async () => {
  mongoose.set('strictQuery', true);

  const connection = await mongoose.connect(env.mongoUri);

  logger.info(`MongoDB connected: ${connection.connection.host}`);

  mongoose.connection.on('error', (error) => {
    logger.error(`MongoDB connection error: ${error.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  return connection;
};
