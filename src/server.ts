import app from './app';
import config from './config/config';
import connectDB from './config/db';

let server: any;

async function bootstrap() {
  try {
    await connectDB();
    server = app.listen(config.port, () => {
      console.log(
        JSON.stringify(
          {
            status: '🚀 Server started successfully',
            serverUrl: `http://localhost:${config.port}`,
            swaggerDocs: `http://localhost:${config.port}/api-docs`,
          },
          null,
          2
        )
      );
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

bootstrap();

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err);
  process.exit(1);
});
