import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

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
  '/',
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.createUser
);

router.post(
  '/register',
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.createUser
);

router.post(
  '/create-user',
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.createUser
);

router.post(
  '/login',
  validateRequest(UserValidation.loginUserValidationSchema),
  UserController.loginUser
);

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getSingleUser);

export const UserRoutes = router;
