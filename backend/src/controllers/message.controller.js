const aiService = require('../services/ai.service');
const AppError = require('../utils/appError.util');

/**
 * Determine severity level based on ML prediction models
 * @param {boolean} isSpam 
 * @param {number} confidence 
 * @returns {string} Safe, Suspicious, or Malicious
 */
const evaluateThreatLevel = (isSpam, confidence) => {
  if (!isSpam) {
    // If it's not spam, but the model had a hard time deciding (e.g. low confidence it's safe)
    if (confidence < 70) return 'Suspicious';
    return 'Safe';
  }
  
  // It IS predicted as spam
  if (confidence > 85) return 'Malicious';
  return 'Suspicious';
};

/**
 * @desc    Scan a text message for Spam/Phishing algorithms
 * @route   POST /api/messages/scan
 * @access  Private
 */
exports.scanMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return next(new AppError('Message text is required for scanning', 400));
    }

    // Call the internal Python Microservice
    let prediction;
    try {
      prediction = await aiService.predictMessage(text);
    } catch (aiError) {
      if (aiError.message === 'AI_SERVICE_OFFLINE') {
        return next(new AppError('The TrueShield AI engine is currently offline for maintenance.', 503));
      }
      if (aiError.message === 'AI_MODELS_NOT_LOADED') {
        return next(new AppError('The AI engine is degraded. Models are currently compiling.', 503));
      }
      return next(new AppError(aiError.message, 500));
    }

    // Translate the ML Output into a UX-friendly Threat Assessment
    const threatLevel = evaluateThreatLevel(prediction.is_spam, prediction.confidence);
    
    // Construct recommendation
    let recommendation = 'No threats detected.';
    if (threatLevel === 'Suspicious') recommendation = 'Exercise caution. Do not click unknown links.';
    if (threatLevel === 'Malicious') recommendation = 'High risk of phishing or scam. Delete this message immediately.';

    res.status(200).json({
      success: true,
      data: {
        originalText: text,
        threatLevel,
        isSpam: prediction.is_spam,
        aiConfidence: `${prediction.confidence}%`,
        recommendation
      }
    });

  } catch (err) {
    next(err);
  }
};
