import { userPaths } from './user/user.swagger';

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
  ],
  paths: {
    ...userPaths,
  },
};

export default swaggerSpec;
