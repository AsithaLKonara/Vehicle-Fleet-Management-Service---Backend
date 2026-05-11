"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe('Backend Foundation - Health Check', () => {
    it('should return 200 OK for /health', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ success: true });
    });
    it('should return 404 for unknown routes', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/unknown');
        expect(res.statusCode).toEqual(404);
    });
});
