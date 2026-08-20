# Stripe Payment Backend

A robust, production-ready backend application for handling Stripe payments, built with **Node.js, Express, TypeScript, and MongoDB**.

## Features

- **Direct Payment Intents**: Generate client secrets for custom Stripe Elements on the frontend.
- **Stripe Checkout Sessions**: Generate Stripe-hosted payment page URLs.
- **Stripe Webhooks**: Securely listen to Stripe events (`checkout.session.completed`, `payment_intent.succeeded`) to automatically update payment statuses in the database.
- **API Documentation**: Integrated Swagger UI for easy API testing and visualization.
- **Validation**: Strict payload validation using Zod.
- **Modular Architecture**: Clean, scalable, and maintainable folder structure.

## Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose)
- **Payment Gateway:** Stripe Node.js SDK
- **Validation:** Zod
- **API Docs:** Swagger (swagger-ui-express)

## Project Structure

```text
stripe_payment_backend/
├── src/
│   ├── config/             # Environment variables and DB connection
│   │   ├── config.ts
│   │   └── db.ts
│   ├── docs/               # Swagger API Documentation (JSON files)
│   │   ├── payment/
│   │   ├── user/
│   │   └── swagger.ts      # Swagger configuration
│   ├── errors/             # Custom Error Handling Formats
│   ├── interface/          # Global Interfaces
│   ├── middlewares/        # Express Middlewares (e.g., errorHandler, notFound)
│   ├── modules/            # Feature Modules (Domain Driven Design)
│   │   ├── payment/        # Stripe Payment Module (Controller, Route, Service, Validation, Model)
│   │   └── user/           # User Module
│   ├── utils/              # Helper functions (catchAsync, AppError, sendResponse)
│   ├── app.ts              # Express App setup (Middlewares, Routes)
│   └── server.ts           # Server initialization and DB connection
├── .env                    # Environment Variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or a MongoDB Atlas URI)
- Stripe Account (Secret Key and Webhook Secret)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Asaduzzaman70/Stripe_Payment_Backend.git
   cd Stripe_Payment_Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=5000
   DATABASE_URL=mongodb://localhost:27017/stripe_payment_db
   JWT_SECRET=your_jwt_secret_here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   NODE_ENV=development
   ```

### Running the Application

**Development Mode:**
```bash
npm run dev
```
*Starts the server using `tsx` with hot-reloading.*

**Production Build:**
```bash
npm run build
npm start
```

## API Documentation

Once the server is running, you can view and test the API endpoints using the Swagger UI:

- **Swagger Docs URL:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### Core Endpoints
- `POST /api/v1/payments/create-intent` - Generate a Stripe Payment Intent.
- `POST /api/v1/payments/create-checkout-session` - Generate a Stripe Checkout Session URL.
- `POST /api/v1/payments/webhook` - Webhook endpoint for Stripe events.

## Local Webhook Testing

To test the Stripe Webhook locally, use the [Stripe CLI](https://stripe.com/docs/stripe-cli):

1. Login to Stripe CLI:
   ```bash
   stripe login
   ```
2. Forward events to your local server:
   ```bash
   stripe listen --forward-to localhost:5000/api/v1/payments/webhook
   ```
3. Update your `.env` file with the generated Webhook Signing Secret (`whsec_...`).
4. Trigger a test event or make a payment via Swagger to see the webhook in action!
