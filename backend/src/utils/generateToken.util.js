const jwt = require('jsonwebtoken');
const env = require('../config/env.config');

/**
 * Generate JWT token for user
 * @param {string} id - User ID
 * @returns {string} - JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

module.exports = generateToken;
