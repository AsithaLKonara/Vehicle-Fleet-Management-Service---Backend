import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { config } from '../config';
import { LoginInput } from '../validators/authValidator';

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: '1d' }
  );

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
