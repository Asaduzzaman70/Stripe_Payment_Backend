import { z } from 'zod';

const createPaymentIntentValidationSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be a positive number'),
    currency: z.string().default('usd'),
    userEmail: z.string().email('Invalid email format'),
    userId: z.string().optional(),
  }),
});

const createCheckoutSessionValidationSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be a positive number'),
    currency: z.string().default('usd'),
    productName: z.string().min(1, 'Product name is required'),
    userEmail: z.string().email('Invalid email format'),
    userId: z.string().optional(),
    successUrl: z.string().url('Invalid success URL'),
    cancelUrl: z.string().url('Invalid cancel URL'),
  }),
});

const createConnectAccountValidationSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    refreshUrl: z.string().url('Invalid refresh URL').optional(),
    returnUrl: z.string().url('Invalid return URL').optional(),
  }),
});

export const PaymentValidation = {
  createPaymentIntentValidationSchema,
  createCheckoutSessionValidationSchema,
  createConnectAccountValidationSchema,
};
