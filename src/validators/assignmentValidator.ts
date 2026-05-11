import { z } from 'zod';

export const createAssignmentSchema = z.object({
  body: z.object({
    vehicleId: z.string().uuid(),
    driverId: z.string().uuid(),
  }),
});

export const returnAssignmentSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>['body'];
