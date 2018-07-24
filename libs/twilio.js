let { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, AUTHY_API_KEY } = process.env;

let twilio = require('twilio');
let client = twilio(null, TWILIO_AUTH_TOKEN);

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

let sendPhoneVerificationCode = async ({ phone_number, code_length = 6 }) => {
  let sent_verification_code = await authy.startPhoneVerification(
    { countryCode: 'US', locale: 'en', phone: phone_number, via: enums.verificationVia.SMS, code_length },
  );

  return sent_verification_code;
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
    call_from: from = TWILIO_PHONE_NUMBER,
    call_url: url,
    call_status_url: StatusCallback,
    call_status_event: StatusCallbackEvent = 'completed',
    call_status_method: StatusCallbackMethod = 'POST',
    recording_url: RecordingStatusCallback,
    recording_status: RecordingStatusCallbackEvent = 'completed',
  } = data;

  let new_call = client.calls.create(
    { url, to, from, StatusCallback, StatusCallbackEvent, StatusCallbackMethod, RecordingStatusCallback, RecordingStatusCallbackEvent }
  );
  
  return new_call;
}

module.exports = {
  checkIfValidPhoneNumber,
  sendPhoneVerificationCode,
  checkVerificationCode,
  createCall,
}