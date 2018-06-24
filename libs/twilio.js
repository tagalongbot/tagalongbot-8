let { AUTHY_API_KEY } = process.env;
let authyClient = require('authy-client');

let { Client, enums } = authyClient;

let authy = new Client({ key: AUTHY_API_KEY });

let sendPhoneVerificationCode = async ({ phone_number = '3475419673' }) => {
  let result = await authy.startPhoneVerification(
    { countryCode: 'US', locale: 'en', phone: phone_number, via: enums.verificationVia.SMS }
  );
  
  return result;
}

let checkVerificationCode = async ({ verification_code }) => {
  let result = await authy.verifyPhone(
    { countryCode: 'US', phone: '5551234567', token: verification_code }
  );
  
  console.log('result', result);
  
  return result;
}

module.exports = {
  sendPhoneVerificationCode,
  checkVerificationCode,
}