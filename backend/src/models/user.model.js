const mongoose = require('mongoose');

/**
 * User Schema
 * Stores registered users after OTP verification
 */
const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      index: true, // For fast lookups
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String, // URL to profile picture
    },
    isVerified: {
      type: Boolean,
      default: false, // OTP verification status
    },
    spamBlockingPreferences: {
      blockKnownSpam: {
        type: Boolean,
        default: true,
      },
      blockHiddenNumbers: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
