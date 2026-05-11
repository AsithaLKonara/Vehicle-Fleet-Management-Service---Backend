"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auditService_1 = require("./auditService");
const getAllUsers = async () => {
    return prisma_1.prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
};
exports.getAllUsers = getAllUsers;
const createUser = async (input, performerId) => {
    const hashedPassword = await bcrypt_1.default.hash(input.password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            ...input,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    await (0, auditService_1.logAction)(performerId, 'CREATE', 'USER', user.id, { email: user.email, role: user.role });
    return user;
};
exports.createUser = createUser;
const updateUser = async (id, input, performerId) => {
    const user = await prisma_1.prisma.user.update({
        where: { id },
        data: input,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    await (0, auditService_1.logAction)(performerId, 'UPDATE', 'USER', user.id, input);
    return user;
};
exports.updateUser = updateUser;
