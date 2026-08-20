import { z } from 'zod';

const createPaymentIntentValidationSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be a positive number'),
    currency: z.string().default('usd'),
    userEmail: z.string().email('Invalid email format'),
    userId: z.string().optional(),
  }),
});

export const PaymentValidation = {
  createPaymentIntentValidationSchema,
};
