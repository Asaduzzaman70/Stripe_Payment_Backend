import { Types } from 'mongoose';

export interface IPayment {
  userId?: Types.ObjectId; // Optional: To track which user made the payment
  transactionId?: string; // Stripe payment intent ID
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  userEmail: string; // The email of the user making the payment
  createdAt?: Date;
  updatedAt?: Date;
}
