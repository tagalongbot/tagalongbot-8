let handleRoute = require('../../middlewares/handleRoute.js');

let { isValidPhoneNumber } = require('../../libs/helpers.js');

let { sendPhoneVerificationCode, checkVerificationCode } = require('../../libs/twilio.js');
let { getPracticeByID } = require('../../libs/data/practices.js');
let { updatePractice, createUpdateMsg } = require('../../libs/practices/claim.js');

let express = require('express');
let router = express.Router();

let askForUserInfo = async ({ query }, res) => {
  let { practice_id } = query;

  let redirect_to_blocks = ['Ask For User Info (Practice)'];
  let set_attributes = { practice_id };
  res.send({ redirect_to_blocks, set_attributes });
}

let verifyPhoneNumber = async ({ query }, res) => {
  let { user_phone_number: phone_number } = query;
  
  if (!isValidPhoneNumber(phone_number)) {
    let redirect_to_blocks = ['Invalid Phone Number (Claim Practice)'];
    res.send({ redirect_to_blocks });
    return;
  }

  let sent_verification_code = await sendPhoneVerificationCode({ phone_number });

  let block_name = (sent_verification_code.success) ? 'Verify Phone Number (Claim Practice)' : '[Error] Verifying Practice';
  let redirect_to_blocks = [block_name];
  res.send({ redirect_to_blocks });
}

let verifyVerificationCode = async ({ query }, res) => {
  let { user_phone_number: phone_number, verification_code } = query;

  let sent_verification_code = await checkVerificationCode({ phone_number, verification_code });

  let block_name = (sent_verification_code.success) ? 'Correct Verification Code (Claim Practice)' : 'Incorrect Verification Code (Claim Practice)';
  let redirect_to_blocks = [block_name];
  res.send({ redirect_to_blocks });
}

let claimPractice = async ({ query }, res) => {
  let { messenger_user_id, practice_id, first_name, user_email, user_phone_number } = query;

  let practice = await getPracticeByID(practice_id);

  if (!practice) {
    let redirect_to_blocks = ['(Claim) Practice Not Available'];
    res.send({ redirect_to_blocks });
    return;
  }

  let updatedPractice = await updatePractice({ messenger_user_id, user_email, user_phone_number, practice });

  let msg = createUpdateMsg({ practice: practice, first_name });

  let messages = [msg];
  res.send({ messages });
}

router.get(
  '/user_info', 
  handleRoute(askForUserInfo, '[Error] Claiming Practice')
);

router.get(
  '/verify',
  handleRoute(verifyPhoneNumber, '[Error] Verifying Practice')
);

router.get(
  '/verify/code',
  handleRoute(verifyVerificationCode, '[Error] Verifying Practice')
);

router.get(
  '/', 
  handleRoute(claimPractice, '[Error] Claiming Practice')
);

module.exports = router;