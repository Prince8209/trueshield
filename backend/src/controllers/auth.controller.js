const authService = require('../services/auth.service');
const AppError = require('../utils/appError.util');

/**
 * Auth Controller
 * Handles HTTP request/response for authentication
 */

/**
 * @desc    Send OTP to phone number
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    // Validate phone
    if (!phone) {
      throw new AppError('Phone number is required', 400);
    }

    // Validate phone format (basic check)
    const phoneRegex = /^\+?[1-9]\d{6,14}$/;
    if (!phoneRegex.test(phone)) {
      throw new AppError('Invalid phone number format. Use E.164 format (e.g., +919876543210)', 400);
    }

    const result = await authService.sendOtp(phone);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify OTP and return JWT token
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    // Validate inputs
    if (!phone || !otp) {
      throw new AppError('Phone number and OTP are required', 400);
    }

    const result = await authService.verifyOtp(phone, otp);

    res.status(200).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
