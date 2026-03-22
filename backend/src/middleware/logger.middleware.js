const morgan = require('morgan');
const env = require('../config/env.config');

/**
 * HTTP request logger middleware
 * Uses 'dev' format in development, 'combined' in production
 */
const logger = morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined');

module.exports = logger;
