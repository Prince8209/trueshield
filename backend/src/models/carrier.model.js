const mongoose = require('mongoose');

const carrierSchema = new mongoose.Schema({
  prefix: { type: String, index: true },
  carrier: String,
  country: String,
});

module.exports = mongoose.model('Carrier', carrierSchema);
