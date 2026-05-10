import { z } from 'zod';

export const orderSchema = z.object({
  tableNumber: z.string().min(1, 'Table number is required').max(20, 'Table number is too long'),
});

export type OrderFormData = z.infer<typeof orderSchema>;
