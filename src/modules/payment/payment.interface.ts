import { Types } from 'mongoose';

export interface IPayment {
  userId?: Types.ObjectId; // Optional: To track which user made the payment
  userEmail: string; // The email of the user making the payment
  recipientId?: Types.ObjectId; // Optional: Recipient user ID
  recipientStripeAccountId?: string; // Connected Stripe Account ID of recipient
  transactionId?: string; // Stripe checkout session or payment intent ID
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserToUserCheckoutPayload {
  amount: number;
  currency?: string;
  title?: string;
  productName?: string;
  recipientId?: string;
  recipientEmail?: string;
  stripeAccountId?: string;
  applicationFee?: number;
  customerEmail?: string;
  userEmail?: string;
  userId?: string;
  successUrl?: string;
  cancelUrl?: string;
}
