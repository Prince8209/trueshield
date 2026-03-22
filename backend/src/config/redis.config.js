const Redis = require('ioredis');
const env = require('./env.config');

/**
 * Create and configure Redis client
 * Used for OTP storage and search result caching
 */
const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 1000,
  lazyConnect: true,
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error(`❌ Redis error: ${err.message}`);
});

/**
 * Initialize Redis connection
 */
const connectRedis = async () => {
  try {
    await redis.connect();
  } catch (error) {
    console.error(`❌ Redis connection failed: ${error.message}`);
  }
};

module.exports = { redis, connectRedis };
