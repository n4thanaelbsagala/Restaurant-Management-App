import { z } from 'zod';

export const financeEntrySchema = z.object({
  type: z.enum(['income', 'expense']),
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  amount: z.coerce
    .number({ invalid_type_error: 'Enter a valid amount' })
    .min(0.01, 'Amount must be greater than 0'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format'),
  category: z.string().min(1, 'Category is required'),
});

export type FinanceEntryFormData = z.infer<typeof financeEntrySchema>;
