import Stripe from 'stripe';
import config from '../../config/config';
import { Payment } from './payment.model';
import AppError from '../../utils/AppError';

// Initialize stripe instance
const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: '2024-12-18.acacia' as any, // Using 'any' to bypass strict type checking for dynamic versioning
});

const createPaymentIntent = async (payload: {
  amount: number;
  currency: string;
  userEmail: string;
  userId?: string;
}) => {
  try {
    // Note: Stripe expects amounts in cents for USD, so multiplying by 100
    // Example: 10 dollars -> 1000 cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(payload.amount * 100),
      currency: payload.currency,
      receipt_email: payload.userEmail,
    });

    // Save initial pending payment record to the database
    const paymentRecord = await Payment.create({
      amount: payload.amount,
      currency: payload.currency,
      userEmail: payload.userEmail,
      userId: payload.userId,
      transactionId: paymentIntent.id,
      status: 'pending',
    });

    return {
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id,
      paymentRecordId: paymentRecord._id,
    };
  } catch (error: any) {
    throw new AppError(500, error.message || 'Failed to create payment intent');
  }
};

const createCheckoutSession = async (payload: {
  amount: number;
  currency: string;
  productName: string;
  userEmail: string;
  userId?: string;
  successUrl: string;
  cancelUrl: string;
}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: payload.userEmail,
      success_url: payload.successUrl,
      cancel_url: payload.cancelUrl,
      line_items: [
        {
          price_data: {
            currency: payload.currency,
            product_data: {
              name: payload.productName,
            },
            unit_amount: Math.round(payload.amount * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
    }); 

    // Save initial pending payment record to the database
    const paymentRecord = await Payment.create({
      amount: payload.amount,
      currency: payload.currency,
      userEmail: payload.userEmail,
      userId: payload.userId,
      transactionId: session.id, // We store session id as transaction id initially
      status: 'pending',
    });

    return {
      url: session.url,
      sessionId: session.id,
      paymentRecordId: paymentRecord._id,
    };
  } catch (error: any) {
    throw new AppError(500, error.message || 'Failed to create checkout session');
  }
};

const handleWebhook = async (rawBody: Buffer, signature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe_webhook_secret as string
    );
  } catch (err: any) {
    throw new AppError(400, `Webhook Error: ${err.message}`);
  }
  
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await Payment.findOneAndUpdate(
        { transactionId: session.id },
        { status: 'succeeded' }
      );
      break;
    }
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await Payment.findOneAndUpdate(
        { transactionId: paymentIntent.id },
        { status: 'succeeded' }
      );
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await Payment.findOneAndUpdate(
        { transactionId: paymentIntent.id },
        { status: 'failed' }
      );
      break;
    }
    default:
      console.log(`Unhandled stripe event type: ${event.type}`);
  }
};

export const PaymentService = {
  createPaymentIntent,
  createCheckoutSession,
  handleWebhook,
};
