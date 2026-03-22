const { Router } = require('express');
const authController = require('../controllers/auth.controller');

const router = Router();

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to phone number
 * @access  Public
 */
router.post('/send-otp', authController.sendOtp);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and return JWT token
 * @access  Public
 */
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;
