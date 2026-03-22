const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  code: { type: String, index: true },
  country: String,
  mobilePrefix: String,
  format: String,
  exampleNumber: String,
});

module.exports = mongoose.model('Country', countrySchema);
