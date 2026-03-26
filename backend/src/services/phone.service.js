const Carrier = require('../models/carrier.model');
const IndiaSTD = require('../models/indiaSTD.model');
const SpamSeed = require('../models/spamSeed.model');
const PhoneDirectory = require('../models/phoneDirectory.model');
const MobileSeries = require('../models/mobileSeries.model');
const { parsePhoneNumber } = require('../utils/phone.util');
const AppError = require('../utils/appError.util');
const env = require('../config/env.config');

/**
 * Perform a full lookup for a phone number against local databases
 * @param {string} rawPhoneNumber 
 * @returns {Object} Rich phone profile
 */
const lookupPhone = async (rawPhoneNumber) => {
  // 1. Parse and format
  const parsed = parsePhoneNumber(rawPhoneNumber);
  if (!parsed.isValid) {
    throw new AppError('Invalid phone number provided.', 400);
  }

  const e164 = parsed.numberE164; // e.g. +919876543210
  const national = parsed.nationalNumber; // e.g. 9876543210

  // The base profile object
  const profile = {
    phoneNumber: e164,
    nationalFormat: national,
    countryCode: parsed.countryCode,
    region: parsed.regionCode,
    type: parsed.type, // MOBILE or LANDLINE
    carrier: 'Unknown',
    location: 'Unknown',
    spamScore: 0,
    spamReportCount: 0,
    isSpam: false,
    name: null,
  };

  try {
    // 2. Lookup Directory (Simulate local crowd-sourced names)
    const directoryEntry = await PhoneDirectory.findOne({ phoneNumber: e164 });
    if (directoryEntry) {
      profile.name = directoryEntry.name;
      if (directoryEntry.city && directoryEntry.state) {
        profile.location = `${directoryEntry.city}, ${directoryEntry.state}`;
      }
      if (directoryEntry.carrier) profile.carrier = directoryEntry.carrier;
    }

    // 3. Indian Mobile Specific Logic (First 4 digits of 10-digit number)
    if (parsed.countryCode === 91 && national.length === 10) {
      const prefix4 = national.substring(0, 4);
      
      // Lookup India Mobile Series
      const seriesData = await MobileSeries.findOne({ series: prefix4 });
      if (seriesData) {
        if (profile.carrier === 'Unknown') profile.carrier = seriesData.operator;
        if (profile.location === 'Unknown') profile.location = seriesData.circle;
      }

      // If landline logic (starts with 0 or 1-8 instead of 9,8,7,6 usually mobile)
      // We check STD codes if it looks like a landline, but libphonenumber mostly handles it.
    }

    // 4. Global Carrier Lookup (if region != IN or mobile series failed)
    if (profile.carrier === 'Unknown') {
      // Find the longest matching prefix for carriers (e.g., +1212)
      // Since it's a small DB, regex match or exact prefix match
      // For simplicity, we just check the first 4-5 digits including CC
      const prefixes = [
        national.substring(0, 4),
        national.substring(0, 3),
        `${parsed.countryCode}${national.substring(0, 3)}`,
      ];
      const carrierMatch = await Carrier.findOne({ prefix: { $in: prefixes } }).sort({ prefix: -1 });
      if (carrierMatch) {
        profile.carrier = carrierMatch.carrier;
      }
    }

    // 5. Check Spam DB
    const spamEntry = await SpamSeed.findOne({ phoneNumber: e164 });
    if (spamEntry) {
      profile.spamScore = spamEntry.spamScore || 80;
      profile.spamReportCount = spamEntry.reportCount || 10;
      profile.isSpam = true;
      if (!profile.name) {
        profile.name = spamEntry.name; // E.g., "Telemarketing Spam"
      }
    }

  } catch (err) {
    console.error('Phone lookup DB error:', err);
    // Continue external fallback despite local DB errors
  }

    // 6. External API Aggregation & Local Caching (Module 6)
    if (!profile.name && env.IPQS_API_KEY) {
      const extApi = require('./externalApi.service');
      // Fetch IPQS Risk + Caller ID Identity in parallel
      const externalData = await extApi.fetchExternalIntelligence(e164);
      
      let cacheUpdated = false;

      // Merge Identity
      if (externalData.identity && externalData.identity.name) {
        profile.name = externalData.identity.name;
        if (profile.carrier === 'Unknown') profile.carrier = externalData.identity.carrier;
        cacheUpdated = true;
      }

      // Merge Risk
      if (externalData.risk) {
        // Only increase spam score if external API says it's higher
        if (externalData.risk.spamScore > profile.spamScore) {
          profile.spamScore = externalData.risk.spamScore;
          profile.isSpam = externalData.risk.isSpam;
        }
      }

      // Automatically cache this new identity into our local MongoDB
      if (cacheUpdated) {
        try {
          await PhoneDirectory.create({
            phoneNumber: e164,
            name: profile.name,
            carrier: profile.carrier,
            city: profile.location.split(',')[0]?.trim() || '',
            state: profile.location.split(',')[1]?.trim() || '',
            type: profile.type,
            spamScore: profile.spamScore
          });
          console.log(`✅ Cached external identity for ${e164} into local DB`);
        } catch (cacheErr) {
          // Ignore duplicate key errors if a race condition occurs
          if (cacheErr.code !== 11000) {
            console.error('Failed to cache external profile:', cacheErr.message);
          }
        }
      }
    }

  return profile;
};

module.exports = {
  lookupPhone,
};
