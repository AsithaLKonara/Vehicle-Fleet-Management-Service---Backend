import app from './app';
import { config } from './config';
import { logger } from './utils/logger';

const server = app.listen(config.PORT, () => {
  logger.info(`🚀 Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception! Shutting down...', err);
  process.exit(1);
});
