import app from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { prisma } from './lib/prisma';

const server = app.listen(config.PORT, () => {
  logger.info(`🚀 Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  
  server.close(async () => {
    logger.info('HTTP server closed.');
    
    try {
      await prisma.$disconnect();
      logger.info('Database connection closed.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during database disconnection:', err);
      process.exit(1);
    }
  });

  // Force shutdown if cleanup takes too long
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection! Shutting down...', err);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception! Shutting down...', err);
  process.exit(1);
});
