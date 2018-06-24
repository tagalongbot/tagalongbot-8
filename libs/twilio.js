let { AUTHY_API_KEY } = process.env;
let authyClient = require('authy-client');

let { Client, enums } = authyClient;

let authy = new Client({ key: AUTHY_API_KEY });

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
  sendPhoneVerificationCode,
  checkVerificationCode,
}