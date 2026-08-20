import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { PaymentService } from './payment.service';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../utils/AppError';

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.createPaymentIntent(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Payment Intent created successfully',
    data: result,
  });
});

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.createCheckoutSession(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Checkout Session created successfully',
    data: result,
  });
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'];
  const rawBody = (req as any).rawBody;

  if (!signature || !rawBody) {
    throw new AppError(400, 'Missing stripe signature or raw body');
  }

  await PaymentService.handleWebhook(rawBody, signature as string);

  res.status(200).json({ received: true });
});

export const PaymentController = {
  createPaymentIntent,
  createCheckoutSession,
  handleWebhook,
};
