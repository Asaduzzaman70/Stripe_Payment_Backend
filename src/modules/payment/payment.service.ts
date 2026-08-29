import Stripe from 'stripe';
import config from '../../config/config';
import { Payment } from './payment.model';
import { User } from '../user/user.model';
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

const createConnectAccount = async (payload: {
  userId?: string;
  email?: string;
  refreshUrl?: string;
  returnUrl?: string;
}) => {
  try {
    let user = null;
    if (payload.userId) {
      user = await User.findById(payload.userId);
    } else if (payload.email) {
      user = await User.findOne({ email: payload.email.toLowerCase() });
    }

    if (!user) {
      throw new AppError(404, 'User not found to connect Stripe account');
    }

    let stripeAccountId = user.stripeAccountId;

    // If user does not have a connected Stripe account yet, create one
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: user.email,
      });

      stripeAccountId = account.id;

      await User.findByIdAndUpdate(user._id, {
        stripeAccountId: account.id,
      });
    }

    // Create Account Onboarding Link
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: payload.refreshUrl || config.stripe_refresh_url,
      return_url: payload.returnUrl || config.stripe_return_url,
      type: 'account_onboarding',
    });

    return {
      url: accountLink.url,
      stripeAccountId,
    };
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(500, error.message || 'Failed to create Stripe Connect onboarding link');
  }
};

const getConnectAccountStatus = async (stripeAccountId: string) => {
  try {
    const account = await stripe.accounts.retrieve(stripeAccountId);
    return {
      id: account.id,
      email: account.email,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      requirements: account.requirements,
    };
  } catch (error: any) {
    throw new AppError(500, error.message || 'Failed to retrieve Stripe Connect account details');
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
    case 'account.updated': {
      const account = event.data.object as Stripe.Account;
      console.log(`Stripe Connect account updated: ${account.id}, details_submitted: ${account.details_submitted}`);
      break;
    }
    default:
      console.log(`Unhandled stripe event type: ${event.type}`);
  }
};

export const PaymentService = {
  createPaymentIntent,
  createCheckoutSession,
  createConnectAccount,
  getConnectAccountStatus,
  handleWebhook,
};
