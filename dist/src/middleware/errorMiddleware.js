"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
const errorMiddleware = (err, req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || [];
    // Log error with structured metadata
    logger_1.logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method}`, {
        stack: config_1.config.NODE_ENV === 'development' ? err.stack : undefined,
        errors,
        userId: req.user?.id,
    });
    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: config_1.config.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.errorMiddleware = errorMiddleware;
