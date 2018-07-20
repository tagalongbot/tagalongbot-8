let handleRoute = require('../../middlewares/handleRoute.js');

let { formatPhoneNumber } = require('../../libs/helpers.js');

let { getAllPractices, updatePractice } = require('../../libs/data/practices.js');

let { checkIfValidPhoneNumber, sendPhoneVerificationCode, checkVerificationCode } = require('../../libs/twilio.js');

let express = require('express');
let router = express.Router();

let verifyPhoneNumber = async ({ query }, res) => {
  let { user_phone_number: phone_number } = query;

  let isValidPhoneNumber = await checkIfValidPhoneNumber({ phone_number });

  if (!isValidPhoneNumber) {
    let redirect_to_blocks = ['Invalid Phone Number (Admin Access)'];
    res.send({ redirect_to_blocks });
    return;
  }

  let sent_verification_code = await sendPhoneVerificationCode({ phone_number });

  let block_name = (sent_verification_code.success) ? 'Verify Phone Number (Admin Access)' : '[Error] Verifying Promo';
  let redirect_to_blocks = [block_name];
  res.send({ redirect_to_blocks });
}

let verifyVerificationCode = async ({ query }, res) => {
  let { user_phone_number: phone_number, verification_code } = query;

  let sent_verification_code = await checkVerificationCode({ phone_number, verification_code });

  let block_name = (sent_verification_code.success) ? 'Correct Verification Code (Admin Access)' : 'Incorrect Verification Code (Admin Access)';
  let redirect_to_blocks = [block_name];
  res.send({ redirect_to_blocks });
}

let getAdminAccess = async ({ query }, res) => {
  let { messenger_user_id, user_phone_number } = query;

  let filterByFormula = `{Main Provider Phone Number} = '${formatPhoneNumber(user_phone_number)}'`;

  let [practice] = await getAllPractices({ filterByFormula });
  
  let update_data = {
    ['Provider Messenger ID']: messenger_user_id
  }

  let updated_practice = await updatePractice(update_data, practice);

  let redirect_to_blocks = ['Admin Access Granted'];
  res.send({ redirect_to_blocks });
}

router.get(
  '/verify',
  handleRoute(verifyPhoneNumber, '[Error] Admin')
);

router.get(
  '/verify/code',
  handleRoute(verifyVerificationCode, '[Error] Admin')
);

router.get(
  '/',
  handleRoute(getAdminAccess, '[Error] Admin')
);

module.exports = router;