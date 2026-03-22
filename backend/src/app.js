import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import logger from './middleware/logger.middleware.js';
import errorHandler from './middleware/error.middleware.js';
import healthRoutes from './routes/health.route.js';

/**
 * Create and configure Express application
 * Registers all middleware, routes, and error handlers
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

export default app;
