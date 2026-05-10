import { z } from 'zod';
import { MenuCategory } from '../types';

export const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  price: z.coerce
    .number({ invalid_type_error: 'Enter a valid price' })
    .min(0.01, 'Price must be greater than 0'),
  category: z.nativeEnum(MenuCategory, { errorMap: () => ({ message: 'Select a category' }) }),
  available: z.boolean().default(true),
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;
