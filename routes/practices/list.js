let handleRoute = require('../../middlewares/handleRoute.js');

let { isValidPhoneNumber } = require('../../libs/helpers.js');
let { sendPhoneVerificationCode, checkVerificationCode, createIncorrectVerificationCodeMsg } = require('../../libs/twilio.js');
let { getUserByMessengerID, updateUser, createUser } = require('../../libs/data/users.js');

let express = require('express');
let router = express.Router();

let createNewUser = async ({ user_email, user_phone_number }) => {
  let update_data = {
    ['Email Address']: user_email,
    ['Phone Number']: user_phone_number
  }

  let new_user = await createUser(update_data);

  return new_user;
}

let updateExistingUser = async ({ user_email, user_phone_number, first_name, last_name, gender, messenger_user_id, user }) => {
  let update_data = {
    ['Email Address']: user_email,
    ['Phone Number']: user_phone_number,
    ['First Name']: first_name,
    ['Last Name']: last_name,
    ['Gender']: gender,
    ['messenger user id']: messenger_user_id,
  }

  let updated_user = await updateUser(update_data, user);

  return updated_user;
}

let verifyPhoneNumber = async ({ query }, res) => {
  let { user_phone_number: phone_number } = query;

  if (!isValidPhoneNumber(phone_number)) {
    let redirect_to_blocks = ['Invalid Phone Number [Verification]', '[JSON] Check Verification Code (List Practice)'];
    res.send({ redirect_to_blocks });
    return;
  }

  let sent_verification_code = await sendPhoneVerificationCode({ phone_number });

  let block_name = (sent_verification_code.success) ? 'Verify Phone Number (List Practice)' : '[Error] Listing Practice';
  let redirect_to_blocks = [block_name];
  res.send({ redirect_to_blocks });
}

let verifyVerificationCode = async ({ query }, res) => {
  let { user_phone_number: phone_number, verification_code } = query;

  let sent_verification_code = await checkVerificationCode({ phone_number, verification_code });

  if (sent_verification_code.success) {
    let redirect_to_blocks = ['[JSON] List Practice', 'List Practice'];
    res.send({ redirect_to_blocks });
  }

  let incorrect_verification_code_msg = createIncorrectVerificationCodeMsg(
    { user_phone_number: phone_number, block_name: '[JSON] Check Verification Code (List Practice)' },
  );

  let messages = [incorrect_verification_code_msg];
  res.send({ messages });
}

let listPractice = async({ query }, res) => {
  let { messenger_user_id, first_name, last_name, gender, user_email, user_phone_number } = query;

  let user = await getUserByMessengerID(messenger_user_id);

  if (!user) {
    let new_user = createNewUser({ user_email, user_phone_number });
    return;
  }

  let updated_user = updateExistingUser({ user_email, user_phone_number, first_name, last_name, gender, messenger_user_id, user });

  res.sendStatus(200);
}

router.get(
  '/verify',
  handleRoute(verifyPhoneNumber, '[Error] User')
);

router.get(
  '/verify/code',
  handleRoute(verifyVerificationCode, '[Error] User')
);

router.get(
  '/',
  handleRoute(listPractice, '[Error] User')
);

module.exports = router;