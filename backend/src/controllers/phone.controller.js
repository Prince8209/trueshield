const phoneService = require('../services/phone.service');
const AppError = require('../utils/appError.util');

/**
 * @desc    Lookup phone number details (Caller ID)
 * @route   GET /api/phone/lookup/:number
 * @access  Private
 */
exports.lookupPhoneNumber = async (req, res, next) => {
  try {
    const rawPhoneNumber = req.params.number;

    if (!rawPhoneNumber) {
      return next(new AppError('Phone number is required for lookup', 400));
    }

    // Perform lookup
    const profile = await phoneService.lookupPhone(rawPhoneNumber);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error); // Let global error handler catch AppErrors
  }
};
