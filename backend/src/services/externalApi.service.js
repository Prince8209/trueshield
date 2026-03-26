const axios = require('axios');
const env = require('../config/env.config');

/**
 * Fetch Risk/Fraud Score from IPQualityScore
 * @param {string} phoneE164 - formatted phone number +1234567890
 * @returns {Object} { spamScore, recentAbuse, isSpam }
 */
const fetchRiskScoreArray = async (phoneE164) => {
  if (env.IPQS_API_KEY === 'mock' || !env.IPQS_API_KEY) {
    // Generate realistic mock data for local testing
    const length = phoneE164.length;
    const lastDigit = parseInt(phoneE164[length - 1]);
    
    // If number ends in 0 or 9, we mock it as spam
    const isMockSpam = lastDigit === 0 || lastDigit === 9;
    
    return {
      spamScore: isMockSpam ? 85 : 10,
      recentAbuse: isMockSpam,
      isSpam: isMockSpam,
      source: 'IPQS (Mock)'
    };
  }

  // --- Production Logic ---
  try {
    const response = await axios.get(`https://www.ipqualityscore.com/api/json/phone/${env.IPQS_API_KEY}/${encodeURIComponent(phoneE164)}`);
    const data = response.data;
    
    if (data.success) {
      return {
        spamScore: data.fraud_score || 0,
        recentAbuse: data.recent_abuse || false,
        isSpam: (data.fraud_score > 75) || data.recent_abuse,
        source: 'IPQS'
      };
    }
    return null;
  } catch (error) {
    console.error('IPQS API Error:', error.message);
    return null;
  }
};

/**
 * Fetch Caller Identity (Name) from a provider like Apyflux or Truecaller Unofficial API
 * @param {string} phoneE164 - formatted phone number
 * @returns {Object} { name, carrier }
 */
const fetchCallerIdentity = async (phoneE164) => {
  if (env.TRUECALLER_API_KEY === 'mock' || !env.TRUECALLER_API_KEY) {
    // Generate realistic mock data for local testing
    const length = phoneE164.length;
    const lastDigit = parseInt(phoneE164[length - 1]);
    
    // If number ends in 0 or 9, mock it as a scammer. Otherwise, generic name.
    const isMockSpam = lastDigit === 0 || lastDigit === 9;
    
    return {
      name: isMockSpam ? 'Reported Telemarketer' : `User_${phoneE164.substring(1, 6)}`,
      carrier: 'External Carrier',
      source: 'CallerID (Mock)'
    };
  }

  // --- Production Logic ---
  try {
    // Placeholder for ApyFlux / Truecaller Unofficial API
    const response = await axios.get(`https://actual-identity-api-provider.com/lookup?key=${env.TRUECALLER_API_KEY}&number=${encodeURIComponent(phoneE164)}`);
    const data = response.data;
    
    if (data && data.name) {
      return {
        name: data.name,
        carrier: data.carrier || 'Unknown',
        source: 'CallerID API'
      };
    }
    return null;
  } catch (error) {
    console.error('Identity API Error:', error.message);
    return null;
  }
};

/**
 * Super API Aggregator: Fetches ID and Risk in parallel
 * @param {string} phoneE164 
 */
const fetchExternalIntelligence = async (phoneE164) => {
  // Execute both API calls in parallel for performance
  const [riskData, identityData] = await Promise.all([
    fetchRiskScoreArray(phoneE164),
    fetchCallerIdentity(phoneE164)
  ]);

  return {
    risk: riskData,
    identity: identityData,
  };
};

module.exports = {
  fetchExternalIntelligence,
};
