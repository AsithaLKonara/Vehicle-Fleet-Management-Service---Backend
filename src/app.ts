import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { requestLogger } from './middleware/requestLogger';
import { errorMiddleware } from './middleware/errorMiddleware';
import { authMiddleware } from './middleware/authMiddleware';
import { authorize } from './middleware/roleMiddleware';
import { apiRateLimiter, authRateLimiter } from './middleware/rateLimiter';
import { correlationIdMiddleware } from './middleware/correlationMiddleware';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import auditRoutes from './routes/auditRoutes';
import reportRoutes from './routes/reportRoutes';
import testRoutes from './routes/testRoutes';

const app = express();

// Security & Infrastructure Middleware
app.use(correlationIdMiddleware);
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json({ limit: '10kb' })); // Limit request size
app.use(requestLogger);

// Global Rate Limiting
app.use('/api/', apiRateLimiter);

// Health Route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true 
  });
});

// Auth Routes (with specific rate limiting)
app.use('/auth', authRateLimiter, authRoutes);

// Business Routes
app.use('/users', userRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/audit', auditRoutes);
app.use('/reports', reportRoutes);
app.use('/test', testRoutes);

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
