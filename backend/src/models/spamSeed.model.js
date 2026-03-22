const mongoose = require('mongoose');

const spamSeedSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, index: true },
  name: String,
  type: { type: String, enum: ['spam', 'scam'] },
  reason: String,
  reportCount: Number,
  spamScore: Number,
  source: String,
});

module.exports = mongoose.model('SpamSeed', spamSeedSchema);
