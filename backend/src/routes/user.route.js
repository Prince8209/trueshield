const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getUserProfile,
  updateUserProfile,
} = require('../controllers/user.controller');

const router = express.Router();

// All routes in this file require authentication
router.use(protect);

router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

module.exports = router;
