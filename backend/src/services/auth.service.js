const User = require('../models/user.model');
const otpService = require('./otp.service');
const generateToken = require('../utils/generateToken.util');
const AppError = require('../utils/appError.util');

/**
 * Auth Service
 * Handles OTP send/verify flow and JWT generation
 */

/**
 * Initiate OTP flow — generate, store in Redis, and send
 * @param {string} phone - User's phone number
 * @returns {Object} Success message
 */
const sendOtp = async (phone) => {
  // Generate OTP
  const otp = otpService.generateOtp();

  // Store in Redis (5 min TTL)
  await otpService.storeOtp(phone, otp);

  // Send OTP (mock in dev, Twilio in prod)
  await otpService.sendOtp(phone, otp);

  return { message: 'OTP sent successfully' };
};

/**
 * Verify OTP and return JWT token
 * Creates user if first-time login
 * @param {string} phone - User's phone number
 * @param {string} otp - OTP entered by user
 * @returns {Object} { token, user }
 */
const verifyOtp = async (phone, otp) => {
  // Get stored OTP from Redis
  const storedOtp = await otpService.getStoredOtp(phone);

  if (!storedOtp) {
    throw new AppError('OTP expired or not found. Please request a new OTP.', 400);
  }

  if (storedOtp !== otp) {
    throw new AppError('Invalid OTP. Please try again.', 400);
  }

  // Delete OTP after successful verification
  await otpService.deleteOtp(phone);

  // Find or create user
  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ phone });
  }

  // Generate JWT token
  const token = generateToken(user);

  return { token, user };
};

module.exports = {
  sendOtp,
  verifyOtp,
};
