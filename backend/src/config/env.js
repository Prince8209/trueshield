import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Centralized environment configuration
 * Validates and exports all required environment variables
 */
const env = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // MongoDB
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/trueshield',

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // AI Service
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',

  // Twilio (OTP)
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || 'mock',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || 'mock',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '+0000000000',
};

/**
 * Validate that critical environment variables are set
 */
const validateEnv = () => {
  const required = ['MONGO_URI', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0 && env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

validateEnv();

export default env;
