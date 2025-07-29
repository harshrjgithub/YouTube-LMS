

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './database/db.js';
import userRouter from './routes/user.route.js';
import courseRouter from './routes/course.route.js';
import { Course } from './models/course.model.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);

// API Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/courses', courseRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
// Compare this snippet from client/src/features/api/authApi.js:
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';