import morgan from 'morgan';
import env from '../config/env.config.js';

/**
 * HTTP request logger middleware
 * Uses 'dev' format in development, 'combined' in production
 */
const logger = morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined');

export default logger;
