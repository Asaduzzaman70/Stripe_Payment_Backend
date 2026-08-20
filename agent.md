## Directory & File Structure

stripe_payment_backend/
├── .env # Environment variables configuration
├── .env.example # Template for environment variables
├── .gitignore # Git ignore rules
├── AGENT.md # Agent and project architectural guide
├── package.json # Dependencies and scripts setup
├── tsconfig.json # TypeScript compiler options
└── src/ # Application source code
├── app.ts # Express application initialization & middleware setup
├── server.ts # Server entry point & database connection trigger
├── config/ # Environment and configuration files
│ ├── config.ts # Centralized configuration object
│ └── db.ts # MongoDB database connection helper
├── docs/ # API Documentation & OpenAPI Specifications
│ └── swagger.ts # Swagger/OpenAPI 3.0 specification & setup middleware
├── middlewares/ # Express custom global middlewares
│ ├── authMiddleware.ts # JWT Authentication & Request protection middleware
│ └── errorHandler.ts # Global error handling middleware
├── modules/ # Feature modules
│ └── <module_name>/ # Feature module directory (e.g., auth, user, etc.)
│ ├── <module_name>.controller.ts # Request & response handlers
│ ├── <module_name>.interface.ts # TypeScript interfaces & inferred types
│ ├── <module_name>.model.ts # Mongoose database model & schema
│ ├── <module_name>.route.ts # Express route definitions
│ ├── <module_name>.service.ts # Domain & business logic
│ └── <module_name>.validation.ts # Zod payload validation schemas
└── utils/ # Application utilities & helpers
├── AppError.ts # Custom operational error class
├── catchAsync.ts # Async error handler wrapper for Express route handlers
└── sendResponse.ts # Standardized API response formatter