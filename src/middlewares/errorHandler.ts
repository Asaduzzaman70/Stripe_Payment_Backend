import { ErrorRequestHandler } from 'express';
import AppError from '../utils/AppError';
import config from '../config/config';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: any[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = err.message ? [{ path: '', message: err.message }] : [];
  } else if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation Error';
    errorMessages = Object.values(err.errors).map((el: any) => {
      return { path: el.path, message: el.message };
    });
  } else if (err instanceof Error) {
    message = err.message;
    errorMessages = err.message ? [{ path: '', message: err.message }] : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? err.stack : undefined,
  });
};

export default globalErrorHandler;
