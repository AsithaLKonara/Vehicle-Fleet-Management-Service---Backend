import { disconnect } from '../src/lib/prisma';

afterAll(async () => {
  await disconnect();
});
