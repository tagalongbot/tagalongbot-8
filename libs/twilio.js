let { AUTHY_API_KEY } = process.env;
let authyClient = require('authy-client');

let { Client, enums } = authyClient;

let authy = new Client({ key: AUTHY_API_KEY });

let sendPhoneVerificationCode = async ({ phone_number = '3475419673' }) => {
  let data = { countryCode: 'US', locale: 'en', phone: phone_number, via: enums.verificationVia.SMS };

  let callback = function(err, res) {
    if (err) throw err;

    console.log('Phone information', res);
  }

  let result = authy.startPhoneVerification(data);
  console.log('result', result);
  return result;
}

let checkVerificationCode = async ({ verification_code }) => {
  authy.verifyPhone({ countryCode: 'US', phone: '5551234567', token: verification_code }, function(err, res) {
    if (err) throw err;

    console.log('Verification code is correct');
  });
}

module.exports = {
  sendPhoneVerificationCode,
  checkVerificationCode,
}