"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.logAction = void 0;
const prisma_1 = require("../lib/prisma");
const logAction = async (userId, action, entity, entityId, metadata, client = prisma_1.prisma) => {
    try {
        await client.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                metadata: metadata || {},
            },
        });
    }
    catch (error) {
        console.error('Failed to log audit action:', error);
    }
};
exports.logAction = logAction;
const getAuditLogs = async () => {
    return prisma_1.prisma.auditLog.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
    });
};
exports.getAuditLogs = getAuditLogs;
