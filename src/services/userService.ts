import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import { CreateUserInput, UpdateUserInput } from '../validators/userValidator';

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

export const createUser = async (input: CreateUserInput) => {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  return prisma.user.create({
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
};

export const updateUser = async (id: string, input: UpdateUserInput) => {
  return prisma.user.update({
    where: { id },
    data: input,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};
