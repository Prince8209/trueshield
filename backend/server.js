import app from './src/app.js';
import env from './src/config/env.config.js';
import connectDB from './src/config/db.config.js';
import { connectRedis } from './src/config/redis.config.js';

/**
 * Start TrueShield Backend Server
 * Connects to MongoDB & Redis, then starts Express
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Connect to Redis
    await connectRedis();

    // Start listening
    app.listen(env.PORT, () => {
      console.log(`\n🛡️  TrueShield Backend running on port ${env.PORT}`);
      console.log(`📍 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 Health: http://localhost:${env.PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
