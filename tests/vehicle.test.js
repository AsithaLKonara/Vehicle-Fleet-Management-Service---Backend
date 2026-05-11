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
describe('Vehicle Management Module', () => {
    let adminToken;
    let staffToken;
    let vehicleId;
    beforeAll(async () => {
        await prisma_1.prisma.vehicle.deleteMany({ where: { plateNumber: 'TEST-999' } });
        await prisma_1.prisma.user.deleteMany({ where: { email: 'staff-user@test.com' } });
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
        const staff = await prisma_1.prisma.user.create({
            data: {
                email: 'staff-user@test.com',
                password: 'password123',
                name: 'Staff User',
                role: 'FLEET_STAFF',
            },
        });
        adminToken = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, role: admin.role }, config_1.config.JWT_SECRET);
        staffToken = jsonwebtoken_1.default.sign({ id: staff.id, email: staff.email, role: staff.role }, config_1.config.JWT_SECRET);
    });
    afterAll(async () => {
        await prisma_1.prisma.vehicle.deleteMany({ where: { plateNumber: 'TEST-999' } });
        await prisma_1.prisma.user.deleteMany({ where: { email: 'staff-user@test.com' } });
        await prisma_1.prisma.$disconnect();
    });
    it('should create a new vehicle by admin', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/vehicles')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            plateNumber: 'TEST-999',
            make: 'Tesla',
            model: 'Model 3',
            year: 2024,
            purchaseCost: 55000,
            status: 'AVAILABLE',
            type: 'Sedan',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body.data.plateNumber).toBe('TEST-999');
        vehicleId = res.body.data.id;
    });
    it('should block staff from creating vehicle', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/vehicles')
            .set('Authorization', `Bearer ${staffToken}`)
            .send({
            plateNumber: 'STF-001',
            make: 'Ford',
            model: 'Transit',
            year: 2023,
            purchaseCost: 35000,
            status: 'AVAILABLE',
        });
        expect(res.statusCode).toEqual(403);
    });
    it('should list vehicles for staff', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/vehicles')
            .set('Authorization', `Bearer ${staffToken}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
    it('should filter vehicles by status', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .get('/vehicles?status=AVAILABLE')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.every((v) => v.status === 'AVAILABLE')).toBe(true);
    });
    it('should update vehicle status', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .patch(`/vehicles/${vehicleId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
            status: 'MAINTENANCE',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toBe('MAINTENANCE');
    });
});
