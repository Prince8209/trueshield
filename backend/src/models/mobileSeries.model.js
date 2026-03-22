const mongoose = require('mongoose');

const mobileSeriesSchema = new mongoose.Schema({
  series: { type: String, unique: true, index: true }, // e.g., '9820'
  operator: String,
  circle: String, // e.g., 'Maharashtra'
  type: String, // 'Mobile'
});

module.exports = mongoose.model('MobileSeries', mobileSeriesSchema);
