"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const prisma_1 = require("../src/lib/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../src/config");
describe('User Management Module', () => {
    let adminToken;
    let managerToken;
    beforeAll(async () => {
        await prisma_1.prisma.assignment.deleteMany({});
        await prisma_1.prisma.auditLog.deleteMany({});
        await prisma_1.prisma.user.deleteMany({ where: { email: { in: ['admin-user@test.com', 'manager-user@test.com', 'new-user@test.com'] } } });
        const admin = await prisma_1.prisma.user.create({
            data: {
                email: 'admin-user@test.com',
                password: 'password123',
                name: 'Admin User',
                role: 'ADMIN',
            },
        });
        const manager = await prisma_1.prisma.user.create({
            data: {
                email: 'manager-user@test.com',
                password: 'password123',
                name: 'Manager User',
                role: 'FLEET_MANAGER',
            },
        });
        adminToken = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, role: admin.role }, config_1.config.JWT_SECRET);
        managerToken = jsonwebtoken_1.default.sign({ id: manager.id, email: manager.email, role: manager.role }, config_1.config.JWT_SECRET);
    });
    afterAll(async () => {
        await prisma_1.prisma.assignment.deleteMany({});
        await prisma_1.prisma.auditLog.deleteMany({});
        await prisma_1.prisma.user.deleteMany({ where: { email: { in: ['admin-user@test.com', 'manager-user@test.com', 'new-user@test.com'] } } });
        await prisma_1.prisma.$disconnect();
    });
    it('should list users for admin', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/users')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
    it('should block non-admin from listing users', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/users')
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.statusCode).toEqual(403);
    });
    it('should create a new user by admin', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            name: 'New User',
            email: 'new-user@test.com',
            password: 'password123',
            role: 'FLEET_STAFF',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body.data.email).toBe('new-user@test.com');
    });
});
