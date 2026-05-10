import { z } from 'zod';
import { ResourceCategory } from '../types';

export const kitchenResourceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  category: z.nativeEnum(ResourceCategory, { errorMap: () => ({ message: 'Select a category' }) }),
  quantity: z.coerce
    .number({ invalid_type_error: 'Enter a valid quantity' })
    .min(0, 'Quantity cannot be negative'),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit is too long'),
  lowStockThreshold: z.coerce
    .number({ invalid_type_error: 'Enter a valid threshold' })
    .min(0, 'Threshold cannot be negative'),
});

export type KitchenResourceFormData = z.infer<typeof kitchenResourceSchema>;
