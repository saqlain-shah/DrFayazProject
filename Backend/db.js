import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // load .env

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://admin:DrFayaz99@127.0.0.1:27017/DrFayazDB?authSource=admin';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected:', MONGO_URI);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectToDatabase;
