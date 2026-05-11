import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { requestLogger } from './middleware/requestLogger';
import { errorMiddleware } from './middleware/errorMiddleware';

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

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized Error Handling
app.use(errorMiddleware);

export default app;
