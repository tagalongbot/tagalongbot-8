let { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, AUTHY_API_KEY } = process.env;

let twilio = require('twilio');
let client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

let authyClient = require('authy-client');
let { Client, enums } = authyClient;

let authy = new Client({ key: AUTHY_API_KEY });

let { getNumbersOnly } = require('../libs/helpers.js');

// Exposed Functions
let checkIfValidPhoneNumber = async ({ phone_number }) => {
  let phone_numbers = getNumbersOnly(phone_number);

  let is_valid = await client.lookups.phoneNumbers(`+1${phone_numbers}`).fetch()
    .catch(err => false);

  return is_valid ? true : false;
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

let createCall = async (data) => {
  let { 
    phone_number: to,
    call_url: url,
    call_status: StatusCallbackEvent = '',
    call_from: from = TWILIO_PHONE_NUMBER, 
  } = data;

  let statusCallback = ``;
  
  let call_options = { url, to, from, statusCallback, statusCallbackMethod };

  return client.calls.create(call_options);
}

module.exports = {
  checkIfValidPhoneNumber,
  sendPhoneVerificationCode,
  checkVerificationCode,
}