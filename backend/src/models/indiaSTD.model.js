const mongoose = require('mongoose');

const indiaSTDSchema = new mongoose.Schema({
  stdCode: { type: String, index: true },
  city: String,
  state: String,
});

module.exports = mongoose.model('IndiaSTD', indiaSTDSchema);
