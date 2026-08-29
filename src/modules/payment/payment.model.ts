import { Schema, model } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    transactionId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'usd',
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed'],
      default: 'pending',
    },
    userEmail: {
      type: String,
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    recipientStripeAccountId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = model<IPayment>('Payment', paymentSchema);
