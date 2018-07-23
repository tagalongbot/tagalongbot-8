let { formatPhoneNumber } = require('../libs/helpers.js');
let { createButtonMessage } = require('../libs/bots.js');

let { checkIfValidPhoneNumber, sendPhoneVerificationCode, checkVerificationCode } = require('../libs/twilio.js');

let createIncorrectVerificationCodeMsg = ({ user_phone_number, block_name }) => {
  let msg = createButtonMessage(
    `Sorry but the code you entered is not the correct code sent to the phone number ${formatPhoneNumber(user_phone_number)}`
    `Try Again|show_block|${block_name}`
  );
  
  return msg;
}

let handleVerifyPhoneNumberRoute = async ({ phone_number, block_name }) => {
  if (!checkIfValidPhoneNumber({ phone_number })) {
    let redirect_to_blocks = ['Invalid Phone Number [Verification]', `[JSON] Get Verification Code (${block_name})`];
    return { redirect_to_blocks };
  }

  let sent_verification_code = await sendPhoneVerificationCode({ phone_number });

  if (sent_verification_code.success) {
    let redirect_to_blocks = ['Ask For Verification Code [Verification]', `[JSON] Check Verification Code (${block_name})`];
    return { redirect_to_blocks };
  }

  let redirect_to_blocks = ['[Error] User'];
  return { redirect_to_blocks };
}

let handleVerifyVerificationCode = async ({ phone_number, verification_code, block_name }) => {
  let sent_verification_code = await checkVerificationCode({ phone_number, verification_code });

  if (sent_verification_code.success) {
    let redirect_to_blocks = [`[JSON] ${block_name}`];
    return { redirect_to_blocks };
  }

  let incorrect_verification_code_msg = createIncorrectVerificationCodeMsg(
    { user_phone_number: phone_number, block_name: `[JSON] Check Verification Code (${block_name})` },
  );

  let messages = [incorrect_verification_code_msg];

  return { messages };
}

module.exports = {
  handleVerifyPhoneNumberRoute,
  handleVerifyVerificationCode,
}