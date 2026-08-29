import express, { NextFunction, Request, Response } from 'express';
import { PaymentController } from './payment.controller';
import { PaymentValidation } from './payment.validation';
import { authMiddleware } from '../../middlewares/authMiddleware';

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

router.post(
  '/create-connect-account',
  authMiddleware('user', 'admin'),
  validateRequest(PaymentValidation.createConnectAccountValidationSchema),
  PaymentController.createConnectAccount
);

router.post(
  '/connect-onboarding',
  authMiddleware('user', 'admin'),
  validateRequest(PaymentValidation.createConnectAccountValidationSchema),
  PaymentController.createConnectAccount
);

router.get(
  '/connect-account-status/:accountId',
  PaymentController.getConnectAccountStatus
);

router.post(
  '/user-to-user-checkout-session',
  (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      return authMiddleware('user', 'admin')(req, res, next);
    }
    next();
  },
  validateRequest(PaymentValidation.createUserToUserCheckoutSessionValidationSchema),
  PaymentController.createUserToUserCheckoutSession
);

router.post(
  '/create-destination-checkout-session',
  (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      return authMiddleware('user', 'admin')(req, res, next);
    }
    next();
  },
  validateRequest(PaymentValidation.createUserToUserCheckoutSessionValidationSchema),
  PaymentController.createUserToUserCheckoutSession
);

router.post('/webhook', PaymentController.handleWebhook);

export const PaymentRoutes = router;
