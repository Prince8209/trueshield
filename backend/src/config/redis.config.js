import Redis from 'ioredis';
import env from './env.config.js';

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

export { redis, connectRedis };
