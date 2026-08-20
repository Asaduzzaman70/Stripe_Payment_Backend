import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { PaymentService } from './payment.service';
import sendResponse from '../../utils/sendResponse';

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.createPaymentIntent(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Payment Intent created successfully',
    data: result,
  });
});

export const PaymentController = {
  createPaymentIntent,
};
