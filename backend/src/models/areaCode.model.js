const mongoose = require('mongoose');

const areaCodeSchema = new mongoose.Schema({
  areaCode: { type: String, index: true },
  city: String,
  state: String,
  country: { type: String, default: 'USA' },
});

module.exports = mongoose.model('AreaCode', areaCodeSchema);
