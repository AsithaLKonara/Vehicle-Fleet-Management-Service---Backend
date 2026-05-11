import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import { CreateUserInput, UpdateUserInput } from '../validators/userValidator';
import { logAction } from './auditService';

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export const createUser = async (input: CreateUserInput, performerId: string) => {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
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

  await logAction(performerId, 'CREATE', 'USER', user.id, { email: user.email, role: user.role });
  return user;
};

export const updateUser = async (id: string, input: UpdateUserInput, performerId: string) => {
  const user = await prisma.user.update({
    where: { id },
    data: input,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  await logAction(performerId, 'UPDATE', 'USER', user.id, input);
  return user;
};
