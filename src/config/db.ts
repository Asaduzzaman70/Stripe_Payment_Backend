import mongoose from 'mongoose';
import config from './config';

const connectDB = async () => {
  try {
    if (!config.database_url) {
      throw new Error('Database URL is missing in the configuration.');
    }
    await mongoose.connect(config.database_url);
    console.log('MongoDB connection SUCCESS');
  } catch (error) {
    console.error('MongoDB connection FAIL', error);
    process.exit(1);
  }
};

export default connectDB;
