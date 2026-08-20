import userPaths from './user/user.swagger.json';
import paymentPaths from './payment/payment.swagger.json';

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Stripe Payment Backend API',
    version: '1.0.0',
    description: 'API documentation for Stripe Payment Backend',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Users',
      description: 'User management',
    },
    {
      name: 'Payments',
      description: 'Stripe Payment Processing',
    },
  ],
  paths: {
    ...userPaths,
    ...paymentPaths,
  },
};

export default swaggerSpec;
