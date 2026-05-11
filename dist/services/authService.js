"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma");
const config_1 = require("../config");
const login = async (input) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { email: input.email },
    });
    if (!user) {
        return null;
    }
    const isPasswordValid = await bcrypt_1.default.compare(input.password, user.password);
    if (!isPasswordValid) {
        return null;
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, config_1.config.JWT_SECRET, { expiresIn: '1d' });
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};
exports.login = login;
