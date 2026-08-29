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

const createUserToUserCheckoutSessionValidationSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be a positive number'),
    currency: z.string().default('usd').optional(),
    title: z.string().optional(),
    productName: z.string().optional(),
    recipientId: z.string().optional(),
    recipientEmail: z.string().email('Invalid email format').optional(),
    stripeAccountId: z.string().optional(),
    applicationFee: z.number().nonnegative().optional(),
    customerEmail: z.string().email('Invalid email format').optional(),
    userEmail: z.string().email('Invalid email format').optional(),
    userId: z.string().optional(),
    successUrl: z.string().url('Invalid success URL').optional(),
    cancelUrl: z.string().url('Invalid cancel URL').optional(),
  }),
});

export const PaymentValidation = {
  createPaymentIntentValidationSchema,
  createCheckoutSessionValidationSchema,
  createConnectAccountValidationSchema,
  createUserToUserCheckoutSessionValidationSchema,
};
