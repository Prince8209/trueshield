const { redis } = require('../config/redis.config');
const env = require('../config/env.config');

/**
 * OTP Service
 * Handles OTP generation, storage in Redis, and sending
 * In dev mode: OTP is always 123456 and logged to console
 * In prod mode: Plug in Twilio or any SMS provider
 */

const OTP_TTL = 300; // 5 minutes in seconds

// Fallback in-memory store for local dev when Redis is down
const inMemoryOTP = new Map();

/**
 * Generate a 6-digit OTP
 * @returns {string} OTP
 */
const generateOTP = () => {
  if (env.NODE_ENV === 'development') {
    return '123456'; // Fixed OTP for development
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Save OTP to cache (Redis or memory)
 * @param {string} phone - User's phone number
 * @param {string} otp - Generated OTP
 */
const saveOTP = async (phone, otp) => {
  try {
    if (redis && redis.status === 'ready') {
      await redis.setex(`otp:${phone}`, OTP_TTL, otp);
    } else {
      // Fallback
      console.warn(`⚠️ Redis offline, saving OTP for ${phone} in memory fallback.`);
      inMemoryOTP.set(`otp:${phone}`, { otp, expiresAt: Date.now() + OTP_TTL * 1000 });
    }
  } catch (error) {
    console.error('Redis save error:', error);
    throw new Error('Could not save OTP');
  }
};

/**
 * Verify OTP from cache
 * @param {string} phone - User's phone number
 * @param {string} otp - User provided OTP
 * @returns {boolean} - true if valid
 */
const verifyOTP = async (phone, otp) => {
  try {
    let storedOtp = null;
    
    if (redis && redis.status === 'ready') {
      storedOtp = await redis.get(`otp:${phone}`);
    } else {
      // Fallback
      const record = inMemoryOTP.get(`otp:${phone}`);
      if (record && record.expiresAt > Date.now()) {
        storedOtp = record.otp;
      }
    }

    if (storedOtp === otp) {
      if (redis && redis.status === 'ready') {
        await redis.del(`otp:${phone}`); // cleanup after successful verify
      } else {
        inMemoryOTP.delete(`otp:${phone}`);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('OTP verification error:', error);
    throw new Error('Could not verify OTP');
  }
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
  generateOTP,
  saveOTP,
  verifyOTP,
  sendOtp,
};
