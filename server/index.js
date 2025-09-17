

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import connectDB from './database/db.js';
import userRouter from './routes/user.route.js';
import courseRouter from './routes/course.route.js';
import { seedAdminUser } from './utils/seedAdmin.js';
import { publishExistingCourses } from './utils/migrateCourses.js';
import { cleanupInvalidEnrollments } from './utils/cleanupEnrollments.js';

dotenv.config();

// Initialize database and seed admin user
const initializeApp = async () => {
  await connectDB();
  await seedAdminUser();
  await publishExistingCourses(); // Migrate existing courses to published status
  await cleanupInvalidEnrollments(); // Clean up invalid enrollment references
};

initializeApp();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// CORS configuration - more flexible for development
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:3000'
  ];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) {
        return callback(null, true);
      }

      // In development, allow localhost on any port
      if (process.env.NODE_ENV !== 'production') {
        const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
        if (isLocalhost) {
          return callback(null, true);
        }
      }

      // Check against allowed origins list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error(`CORS Error: Origin ${origin} not allowed`);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  })
);

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

// API Routes
app.use('/api/v1/users', authLimiter, userRouter);
app.use('/api/v1/courses', courseRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
// Compare this snippet from client/src/features/api/authApi.js:
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';