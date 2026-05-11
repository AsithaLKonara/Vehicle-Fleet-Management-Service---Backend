import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export type AuditClient = Prisma.TransactionClient | typeof prisma;

export const logAction = async (
  userId: string, 
  action: string, 
  resource: string, 
  details?: Prisma.InputJsonValue,
  client: AuditClient = prisma
) => {
  try {
    await client.auditLog.create({
      data: {
        userId,
        action,
        resource,
        details: details || {},
      },
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
};

export const getAuditLogs = async () => {
  return prisma.auditLog.findMany({
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
