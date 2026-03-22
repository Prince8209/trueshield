const mongoose = require('mongoose');

const phoneDirectorySchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, index: true },
  name: String,
  city: String,
  state: String,
  carrier: String,
  type: { type: String, default: 'Mobile' },
  spamScore: { type: Number, default: 0 }
});

module.exports = mongoose.model('PhoneDirectory', phoneDirectorySchema);
