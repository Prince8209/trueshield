const express = require('express');
const { lookupPhoneNumber } = require('../controllers/phone.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Phone lookup requires a logged-in user (simulating Truecaller model)
router.use(protect);

router.route('/lookup/:number')
  .get(lookupPhoneNumber);

module.exports = router;
