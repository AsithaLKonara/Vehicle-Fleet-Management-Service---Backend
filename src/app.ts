import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { requestLogger } from './middleware/requestLogger';
import { errorMiddleware } from './middleware/errorMiddleware';
import { authMiddleware } from './middleware/authMiddleware';
import { authorize } from './middleware/roleMiddleware';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import assignmentRoutes from './routes/assignmentRoutes';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN }));

// Request Parsing
app.use(express.json());

// Logging
app.use(requestLogger);

// Health Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth Routes
app.use('/auth', authRoutes);

// User Routes
app.use('/users', userRoutes);

// Vehicle Routes
app.use('/vehicles', vehicleRoutes);

// Assignment Routes
app.use('/assignments', assignmentRoutes);

// Protected Test Route
app.get('/protected-test', authMiddleware, authorize(['ADMIN']), (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome Admin!', user: req.user });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized Error Handling
app.use(errorMiddleware);

export default app;
