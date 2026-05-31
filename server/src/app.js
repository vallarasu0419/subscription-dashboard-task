import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

const app = express();

// Core security & parsing middleware.
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true, // required so the refresh-token cookie is accepted
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (!env.isProduction) {
  app.use(morgan('dev'));
}

// All API routes live under /api.
app.use('/api', routes);

// Unmatched routes and centralized error handling come last.
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
