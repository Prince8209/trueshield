const app = require('./src/app');
const env = require('./src/config/env.config');
const connectDB = require('./src/config/db.config');
const { connectRedis } = require('./src/config/redis.config');

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
