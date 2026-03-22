import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from './config/env.config.js';
import connectDB from './config/db.config.js';
import { connectRedis } from './config/redis.config.js';
import logger from './middleware/logger.middleware.js';
import errorHandler from './middleware/error.middleware.js';
import healthRoutes from './routes/health.route.js';

/**
 * Initialize Express application
 */
const app = express();

// --- Security & Parsing Middleware ---
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Logging ---
app.use(logger);

// --- Routes ---
app.use('/api/health', healthRoutes);

// --- 404 Handler ---
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// --- Global Error Handler ---
app.use(errorHandler);

/**
 * Start the server and connect to databases
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

export default app;
