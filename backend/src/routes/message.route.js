const express = require('express');
const { scanMessage } = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Require JWT for scanning to prevent anonymous API abuse
router.use(protect);

router.post('/scan', scanMessage);

module.exports = router;
