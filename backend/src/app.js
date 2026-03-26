const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./middleware/logger.middleware');
const errorHandler = require('./middleware/error.middleware');
const healthRoutes = require('./routes/health.route');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const phoneRoutes = require('./routes/phone.route');
const spamRoutes = require('./routes/spam.route');
const messageRoutes = require('./routes/message.route');

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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/phone', phoneRoutes);
app.use('/api/spam', spamRoutes);
app.use('/api/messages', messageRoutes);

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// --- Global Error Handler ---
app.use(errorHandler);

module.exports = app;
