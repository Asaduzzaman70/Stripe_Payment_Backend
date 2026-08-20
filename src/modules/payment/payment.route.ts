import express, { NextFunction, Request, Response } from 'express';
import { PaymentController } from './payment.controller';
import { PaymentValidation } from './payment.validation';

const router = express.Router();

const validateRequest = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      return next();
    } catch (error) {
      next(error);
    }
  };
};

router.post(
  '/create-intent',
  validateRequest(PaymentValidation.createPaymentIntentValidationSchema),
  PaymentController.createPaymentIntent
);

router.post(
  '/create-checkout-session',
  validateRequest(PaymentValidation.createCheckoutSessionValidationSchema),
  PaymentController.createCheckoutSession
);

router.post('/webhook', PaymentController.handleWebhook);

export const PaymentRoutes = router;
