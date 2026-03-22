const { redis } = require('../config/redis.config');
const env = require('../config/env.config');

/**
 * OTP Service
 * Handles OTP generation, storage in Redis, and sending
 * In dev mode: OTP is always 123456 and logged to console
 * In prod mode: Plug in Twilio or any SMS provider
 */

const OTP_EXPIRY = 300; // 5 minutes in seconds

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOtp = () => {
  if (env.NODE_ENV === 'development') {
    return '123456'; // Fixed OTP for development
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP in Redis with expiry
 * @param {string} phone - Phone number (key)
 * @param {string} otp - OTP value
 */
const storeOtp = async (phone, otp) => {
  const key = `otp:${phone}`;
  await redis.set(key, otp, 'EX', OTP_EXPIRY);
};

/**
 * Retrieve OTP from Redis
 * @param {string} phone - Phone number
 * @returns {string|null} Stored OTP or null if expired
 */
const getStoredOtp = async (phone) => {
  const key = `otp:${phone}`;
  return await redis.get(key);
};

/**
 * Delete OTP from Redis after verification
 * @param {string} phone - Phone number
 */
const deleteOtp = async (phone) => {
  const key = `otp:${phone}`;
  await redis.del(key);
};

/**
 * Send OTP to the user
 * In dev: logs to console
 * In prod: integrate Twilio here
 * @param {string} phone - Phone number
 * @param {string} otp - OTP to send
 */
const sendOtp = async (phone, otp) => {
  if (env.NODE_ENV === 'development') {
    console.log(`📱 [DEV] OTP for ${phone}: ${otp}`);
    return true;
  }

  // TODO: Production — Twilio integration
  // const client = require('twilio')(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  // await client.messages.create({
  //   body: `Your TrueShield OTP is: ${otp}`,
  //   from: env.TWILIO_PHONE_NUMBER,
  //   to: phone,
  // });

  return true;
};

module.exports = {
  generateOtp,
  storeOtp,
  getStoredOtp,
  deleteOtp,
  sendOtp,
};
