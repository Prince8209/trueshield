const libphonenumber = require('google-libphonenumber');
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
const PNF = libphonenumber.PhoneNumberFormat;
const errExt = require('./appError.util'); // ensure using the proper custom error class if needed

/**
 * Format and Validate Phone Number
 * @param {string} rawNumber - The raw phone number string (with or without '+')
 * @param {string} defaultRegion - Default country code (e.g., 'IN' for India)
 * @returns {Object} { isValid, numberE164, countryCode, nationalNumber, type }
 */
const parsePhoneNumber = (rawNumber, defaultRegion = 'IN') => {
  try {
    // Prefix with '+' if missing and looks like international
    let numberToParse = rawNumber;
    if (!numberToParse.startsWith('+') && numberToParse.length > 10) {
      numberToParse = '+' + numberToParse;
    }

    const number = phoneUtil.parseAndKeepRawInput(numberToParse, defaultRegion);
    const isValid = phoneUtil.isValidNumber(number);

    if (!isValid) {
      return { isValid: false, error: 'Invalid phone number format' };
    }

    const numberE164 = phoneUtil.format(number, PNF.E164);
    const countryCode = number.getCountryCode();
    const nationalNumber = number.getNationalNumber().toString();
    const regionCode = phoneUtil.getRegionCodeForNumber(number);

    // Determine basic type (Mobile/Fixed/TollFree based on length/rules in libphonenumber, might be generic for some regions)
    const numberType = phoneUtil.getNumberType(number);
    let typeString = 'UNKNOWN';
    if (numberType === libphonenumber.PhoneNumberType.MOBILE) typeString = 'MOBILE';
    if (numberType === libphonenumber.PhoneNumberType.FIXED_LINE) typeString = 'LANDLINE';
    if (numberType === libphonenumber.PhoneNumberType.FIXED_LINE_OR_MOBILE) typeString = 'MOBILE_OR_LANDLINE';
    if (numberType === libphonenumber.PhoneNumberType.TOLL_FREE) typeString = 'TOLL_FREE';

    return {
      isValid: true,
      numberE164,
      countryCode,
      nationalNumber,
      regionCode,
      type: typeString,
    };
  } catch (error) {
    return { isValid: false, error: 'Could not parse phone number' };
  }
};

module.exports = {
  parsePhoneNumber,
};
