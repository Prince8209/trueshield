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
  const otp = otpService.generateOTP();

  // Store in cache (Redis/Memory)
  await otpService.saveOTP(phone, otp);

  // Send OTP
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
  // Verify OTP from cache
  const isValid = await otpService.verifyOTP(phone, otp);

  if (!isValid) {
    throw new AppError('Invalid or expired OTP. Please try again.', 400);
  }

  // Find or create user
  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ phone });
  }

  // Generate JWT token
  const token = generateToken(user._id);

  return { token, user };
};

module.exports = {
  sendOtp,
  verifyOtp,
};
