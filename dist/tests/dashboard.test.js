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
describe('Dashboard Module', () => {
    let adminToken;
    beforeAll(async () => {
        let admin = await prisma_1.prisma.user.findUnique({ where: { email: 'admin-user@test.com' } });
        if (!admin) {
            admin = await prisma_1.prisma.user.create({
                data: {
                    email: 'admin-user@test.com',
                    password: 'password123',
                    name: 'Admin User',
                    role: 'ADMIN',
                },
            });
        }
        adminToken = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, role: admin.role }, config_1.config.JWT_SECRET);
    });
    it('should get dashboard stats', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/dashboard/stats')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('totalUsers');
        expect(res.body.data).toHaveProperty('totalVehicles');
        expect(res.body.data).toHaveProperty('activeAssignments');
        expect(Array.isArray(res.body.data.statusDistribution)).toBe(true);
    });
});
