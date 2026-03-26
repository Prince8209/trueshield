const SpamReport = require('../models/spamReport.model');
const SpamSeed = require('../models/spamSeed.model');
const PhoneDirectory = require('../models/phoneDirectory.model');
const { parsePhoneNumber } = require('../utils/phone.util');
const AppError = require('../utils/appError.util');

// Helper to recalculate global spam score
const calculateGlobalScore = (reportCount) => {
  if (reportCount <= 0) return 0;
  // Let 1 report = 60%, 5 reports = 85%, 10+ = 100%
  let score = 50 + (reportCount * 10);
  return Math.min(100, score);
};

/**
 * @desc    Report a number as spam
 * @route   POST /api/spam/report
 * @access  Private
 */
exports.reportSpamNumber = async (req, res, next) => {
  try {
    const { phoneNumber, reason = 'other', name } = req.body;
    
    if (!phoneNumber) {
      return next(new AppError('Phone number is required', 400));
    }

    const parsed = parsePhoneNumber(phoneNumber);
    if (!parsed.isValid) {
      return next(new AppError('Invalid phone number format', 400));
    }

    const e164 = parsed.numberE164;

    // Check if user already reported this
    const existingReport = await SpamReport.findOne({ user: req.user.id, phoneNumber: e164 });
    if (existingReport) {
      return next(new AppError('You have already reported this number', 400));
    }

    // 1. Create User Spam Report
    await SpamReport.create({
      user: req.user.id,
      phoneNumber: e164,
      reason
    });

    // 2. Update Global SpamSeed Database
    let spamEntry = await SpamSeed.findOne({ phoneNumber: e164 });
    if (!spamEntry) {
      spamEntry = new SpamSeed({
        phoneNumber: e164,
        name: name || 'Reported Number',
        type: 'spam',
        reason: reason,
        reportCount: 0,
        source: 'crowdsourced'
      });
    }

    spamEntry.reportCount += 1;
    spamEntry.spamScore = calculateGlobalScore(spamEntry.reportCount);
    await spamEntry.save();

    // 3. Update PhoneDirectory Cache if it exists
    await PhoneDirectory.updateOne(
      { phoneNumber: e164 },
      { $set: { spamScore: spamEntry.spamScore } }
    );

    res.status(200).json({
      success: true,
      message: 'Number successfully reported as spam',
      data: {
        newSpamScore: spamEntry.spamScore,
        totalReports: spamEntry.reportCount
      }
    });

  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Remove a user's spam report
 * @route   POST /api/spam/unreport
 * @access  Private
 */
exports.unreportSpamNumber = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return next(new AppError('Phone number is required', 400));
    }

    const parsed = parsePhoneNumber(phoneNumber);
    if (!parsed.isValid) return next(new AppError('Invalid format', 400));
    const e164 = parsed.numberE164;

    // Find and delete the report
    const deletedReport = await SpamReport.findOneAndDelete({ user: req.user.id, phoneNumber: e164 });
    
    if (!deletedReport) {
      return next(new AppError('You have not reported this number', 404));
    }

    // Update Global SpamSeed
    const spamEntry = await SpamSeed.findOne({ phoneNumber: e164 });
    if (spamEntry) {
      spamEntry.reportCount = Math.max(0, spamEntry.reportCount - 1);
      spamEntry.spamScore = calculateGlobalScore(spamEntry.reportCount);
      
      if (spamEntry.reportCount === 0) {
        // No one thinks it's spam anymore, remove from SpamSeed
        await SpamSeed.deleteOne({ _id: spamEntry._id });
        await PhoneDirectory.updateOne({ phoneNumber: e164 }, { $set: { spamScore: 0 } });
      } else {
        await spamEntry.save();
        await PhoneDirectory.updateOne({ phoneNumber: e164 }, { $set: { spamScore: spamEntry.spamScore } });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Spam report removed successfully'
    });

  } catch (err) {
    next(err);
  }
};
