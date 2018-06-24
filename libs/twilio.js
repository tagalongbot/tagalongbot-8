let { AUTHY_API_KEY } = process.env;
let authyClient = require('authy-client');

let { Client, enums } = authyClient;

let authy = new Client({ key: AUTHY_API_KEY });

let sendPhoneVerificationCode = async ({ phone_number = '3475419673' }) => {
  authy.startPhoneVerification({ countryCode: 'US', locale: 'en', phone: phone_number, via: enums.verificationVia.SMS }, function(err, res) {
    if (err) throw err;

    console.log('Phone information', res);
  });
}

let checkVerificationCode = async () => {
  authy.verifyPhone({ countryCode: 'US', phone: '5551234567', token: '1234' }, function(err, res) {
    if (err) throw err;

    console.log('Verification code is correct');
  });
}

module.exports = {
  sendPhoneVerificationCode,
  checkVerificationCode,
}