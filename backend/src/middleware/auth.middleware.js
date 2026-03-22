const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const env = require('../config/env.config');
const AppError = require('../utils/appError.util');

/**
 * Auth Middleware — Protect routes
 * Verifies JWT token from Authorization header
 * Attaches user object to req.user
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Not authorized. No token provided.', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Find user and attach to request
    const user = await User.findById(decoded.id).select('-__v');

    if (!user) {
      throw new AppError('User not found. Token may be invalid.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please login again.', 401));
    }
    next(error);
  }
};

module.exports = { protect };
