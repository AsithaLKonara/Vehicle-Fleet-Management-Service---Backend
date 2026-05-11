"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("./config");
const requestLogger_1 = require("./middleware/requestLogger");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const authMiddleware_1 = require("./middleware/authMiddleware");
const roleMiddleware_1 = require("./middleware/roleMiddleware");
const rateLimiter_1 = require("./middleware/rateLimiter");
const correlationMiddleware_1 = require("./middleware/correlationMiddleware");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const vehicleRoutes_1 = __importDefault(require("./routes/vehicleRoutes"));
const assignmentRoutes_1 = __importDefault(require("./routes/assignmentRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const app = (0, express_1.default)();
// Security & Infrastructure Middleware
app.use(correlationMiddleware_1.correlationIdMiddleware);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: config_1.config.CORS_ORIGIN }));
app.use(express_1.default.json({ limit: '10kb' })); // Limit request size
app.use(requestLogger_1.requestLogger);
// Global Rate Limiting
app.use('/api/', rateLimiter_1.apiRateLimiter);
// Health Route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true
    });
});
// Auth Routes (with specific rate limiting)
app.use('/auth', rateLimiter_1.authRateLimiter, authRoutes_1.default);
// Business Routes
app.use('/users', userRoutes_1.default);
app.use('/vehicles', vehicleRoutes_1.default);
app.use('/assignments', assignmentRoutes_1.default);
app.use('/dashboard', dashboardRoutes_1.default);
// Protected Test Route
app.get('/protected-test', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.authorize)(['ADMIN']), (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome Admin!', user: req.user });
});
// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});
// Centralized Error Handling
app.use(errorMiddleware_1.errorMiddleware);
exports.default = app;
