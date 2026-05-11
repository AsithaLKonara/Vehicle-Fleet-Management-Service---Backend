"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnAssignmentSchema = exports.createAssignmentSchema = void 0;
const zod_1 = require("zod");
exports.createAssignmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        vehicleId: zod_1.z.string().uuid(),
        driverId: zod_1.z.string().uuid(),
    }),
});
exports.returnAssignmentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
});
