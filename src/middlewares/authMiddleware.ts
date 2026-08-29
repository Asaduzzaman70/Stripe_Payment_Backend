import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import AppError from '../utils/AppError';

interface JwtPayload {
  userId: string;
  email?: string;
  role: string;
}

export const authMiddleware = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(401, 'You are not authorized!');
      }

      let verifiedUser = null;
      try {
        verifiedUser = jwt.verify(
          token.split(' ')[1] || token,
          config.jwt_secret as string
        ) as JwtPayload;
      } catch (error) {
        throw new AppError(401, 'Invalid token');
      }

      req.user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new AppError(403, 'Forbidden');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Add user to Express Request
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
