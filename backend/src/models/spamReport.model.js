const mongoose = require('mongoose');

const spamReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    index: true,
  },
  reason: {
    type: String,
    required: true,
    enum: ['scam', 'telemarketing', 'robocall', 'other'],
    default: 'other',
  },
}, { timestamps: true });

// Prevent a single user from reporting the same number multiple times
spamReportSchema.index({ user: 1, phoneNumber: 1 }, { unique: true });

module.exports = mongoose.model('SpamReport', spamReportSchema);
