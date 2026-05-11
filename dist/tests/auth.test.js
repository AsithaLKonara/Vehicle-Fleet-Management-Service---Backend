"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const prisma_1 = require("../src/lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
describe('Authentication Module', () => {
    const testUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'ADMIN',
    };
    beforeAll(async () => {
        // Cleanup and create test user
        await prisma_1.prisma.auditLog.deleteMany({});
        await prisma_1.prisma.user.deleteMany({ where: { email: testUser.email } });
        const hashedPassword = await bcrypt_1.default.hash(testUser.password, 10);
        await prisma_1.prisma.user.create({
            data: {
                email: testUser.email,
                password: hashedPassword,
                name: testUser.name,
                role: 'ADMIN',
            },
        });
    });
    afterAll(async () => {
        await prisma_1.prisma.auditLog.deleteMany({});
        await prisma_1.prisma.user.deleteMany({ where: { email: testUser.email } });
        await prisma_1.prisma.$disconnect();
    });
    it('should login successfully with valid credentials', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({
            email: testUser.email,
            password: testUser.password,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
        expect(res.body.data.user.email).toBe(testUser.email);
    });
    it('should fail login with invalid password', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({
            email: testUser.email,
            password: 'wrongpassword',
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });
    it('should fail login with non-existent email', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({
            email: 'nobody@example.com',
            password: 'password123',
        });
        expect(res.statusCode).toEqual(401);
    });
    it('should block access to protected route without token', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/protected-test');
        expect(res.statusCode).toEqual(401);
    });
    it('should allow access to protected route with valid token', async () => {
        // Login to get token
        const loginRes = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({
            email: testUser.email,
            password: testUser.password,
        });
        const token = loginRes.body.data.token;
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/protected-test')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Welcome Admin!');
    });
});
