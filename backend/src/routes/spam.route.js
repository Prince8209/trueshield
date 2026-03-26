const express = require('express');
const { reportSpamNumber, unreportSpamNumber } = require('../controllers/spam.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All spam actions must be authenticated
router.use(protect);

router.post('/report', reportSpamNumber);
router.post('/unreport', unreportSpamNumber);

module.exports = router;
