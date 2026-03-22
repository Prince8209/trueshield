import env from '../config/env.config.js';

/**
 * Global error handling middleware
 * Catches all errors and returns standardized JSON response
 */
const errorHandler = (err, req, res, next) => {
    // Default values
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log error in development
    if (env.NODE_ENV === 'development') {
        console.error('❌ Error:', {
            message,
            statusCode,
            stack: err.stack,
        });
    }

    // Send response
    res.status(statusCode).json({
        success: false,
        message,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;
