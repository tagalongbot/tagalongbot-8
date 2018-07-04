let { AUTHY_API_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, CUSTOMER_XML_DOC_URL } = process.env;

let twilio = require('twilio');
let client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

let authyClient = require('authy-client');
let { Client, enums } = authyClient;

let authy = new Client({ key: AUTHY_API_KEY });

// Exposed Functions
let checkIfValidPhoneNumber = async ({ phone_number }) => {
  
}

let sendPhoneVerificationCode = async ({ phone_number = '3475419673', code_length = 6 }) => {
  let result = await authy.startPhoneVerification(
    { countryCode: 'US', locale: 'en', phone: phone_number, via: enums.verificationVia.SMS },
    { codeLength: code_length }
  );

  return result;
}

let checkVerificationCode = async ({ phone_number, verification_code }) => {
  let result = await authy.verifyPhone(
    { countryCode: 'US', phone: phone_number, token: verification_code }
  );
  
  return result;
}

module.exports = {
  checkIfValidPhoneNumber,
  sendPhoneVerificationCode,
  checkVerificationCode,
}