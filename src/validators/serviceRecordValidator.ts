import { z } from 'zod';

export const createServiceRecordSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    serviceDate: z.string().datetime().or(z.date()),
    cost: z.number().min(0, 'Cost must be non-negative'),
  }),
});
