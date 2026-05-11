"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
const prisma_1 = require("./lib/prisma");
const server = app_1.default.listen(config_1.config.PORT, () => {
    logger_1.logger.info(`🚀 Server running in ${config_1.config.NODE_ENV} mode on port ${config_1.config.PORT}`);
});
const gracefulShutdown = async (signal) => {
    logger_1.logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
        logger_1.logger.info('HTTP server closed.');
        try {
            await prisma_1.prisma.$disconnect();
            logger_1.logger.info('Database connection closed.');
            process.exit(0);
        }
        catch (err) {
            logger_1.logger.error('Error during database disconnection:', err);
            process.exit(1);
        }
    });
    // Force shutdown if cleanup takes too long
    setTimeout(() => {
        logger_1.logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
    logger_1.logger.error('Unhandled Rejection! Shutting down...', err);
    gracefulShutdown('unhandledRejection');
});
process.on('uncaughtException', (err) => {
    logger_1.logger.error('Uncaught Exception! Shutting down...', err);
    process.exit(1);
});
