const AppError = require('../utils/appError.util');
const User = require('../models/user.model');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(new AppError('Failed to retrieve user profile', 500));
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Allowed fields for update
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.avatar) user.avatar = req.body.avatar;

    // Process spamBlockingPreferences update specifically to avoid overwriting nested object
    if (req.body.spamBlockingPreferences) {
      if (req.body.spamBlockingPreferences.blockKnownSpam !== undefined) {
        user.spamBlockingPreferences.blockKnownSpam = req.body.spamBlockingPreferences.blockKnownSpam;
      }
      if (req.body.spamBlockingPreferences.blockHiddenNumbers !== undefined) {
        user.spamBlockingPreferences.blockHiddenNumbers = req.body.spamBlockingPreferences.blockHiddenNumbers;
      }
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(new AppError('Failed to update user profile', 500));
  }
};
