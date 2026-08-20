import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';
// import routes later

import globalErrorHandler from './middlewares/errorHandler';

const app: Application = express();

// Parsers
app.use(express.json());
app.use(cors());

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

import { UserRoutes } from './modules/user/user.route';
import { PaymentRoutes } from './modules/payment/payment.route';

// Application Routes
app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/payments', PaymentRoutes);

// Root Route
app.get('/', (req: Request, res: Response) => {
  res.send('Stripe Payment Backend is running!');
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
