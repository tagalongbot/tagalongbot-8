let handleRoute = require('../../middlewares/handleRoute.js');

let { convertLongTextToArray } = require('../../libs/helpers.js');

let { getPracticeByID } = require('../../libs/data/practices.js');
let { getPracticePromo } = require('../../libs/data/practice/promos.js');

let { checkIfValidPhoneNumber, sendPhoneVerificationCode, checkVerificationCode } = require('../../libs/twilio.js');

let { updatePromo, updateClaimedUser, createLead, createClaimedMsg, createNoCallMsg } = require('../../libs/promos/claim.js');

let express = require('express');
let router = express.Router();

let askForUserInfo = async ({ query }, res) => {
  let { promo_id, practice_id } = query;

  let redirect_to_blocks = ['Ask For User Info (Promo)'];
  let set_attributes = { promo_id, practice_id };
  res.send({ redirect_to_blocks, set_attributes });
}

let verifyPhoneNumber = async ({ query }, res) => {
  let { user_phone_number: phone_number } = query;

  let isValidPhoneNumber = await checkIfValidPhoneNumber({ phone_number });

  if (!isValidPhoneNumber) {
    let redirect_to_blocks = ['Invalid Phone Number (Claim Promo)'];
    res.send({ redirect_to_blocks });
    return;
  }

  let sent_verification_code = await sendPhoneVerificationCode({ phone_number });

  let block_name = (sent_verification_code.success) ? 'Verify Phone Number (Claim Promo)' : '[Error] Verifying Promo';
  let redirect_to_blocks = [block_name];
  res.send({ redirect_to_blocks });
}

let verifyVerificationCode = async ({ query }, res) => {
  let { user_phone_number: phone_number, verification_code } = query;

  let sent_verification_code = await checkVerificationCode({ phone_number, verification_code });

  let block_name = (sent_verification_code.success) ? 'Correct Verification Code (Claim Promo)' : 'Incorrect Verification Code (Claim Promo)';
  let redirect_to_blocks = [block_name];
  res.send({ redirect_to_blocks });
}

let claimPromotion = async ({ query }, res) => {
  let { practice_id, promo_id, messenger_user_id, first_name, last_name, gender, user_email, user_phone_number } = query;

  let practice = await getPracticeByID(practice_id);
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let promo = await getPracticePromo(
    { practice_promos_base_id, promo_id }
  );

  if (!promo || promo.fields['Claim Limit Reached'] === '1') {
    let redirect_to_blocks = ['Promo No Longer Valid'];
    res.send({ redirect_to_blocks });
    return;
  }

  let user = await updateClaimedUser(
    { practice, promo, messenger_user_id, first_name, last_name, gender, user_email, user_phone_number },
  );

  let claimed_by_users = convertLongTextToArray(
    promo.fields['Claimed By Users']
  );

  if (claimed_by_users.includes(user.id)) {
    let redirect_to_blocks = ['Promo Already Claimed By User'];
    res.send({ redirect_to_blocks });
    return;
  }

  let updated_promo = await updatePromo(
    { practice, promo, user, claimed_by_users }
  );
  
  let new_lead = await createLead(
    { practice, promo, user }
  );

  let claimedMsg = createClaimedMsg(
    { first_name, last_name, gender, messenger_user_id, practice, updated_promo }
  );

  let messages = [claimedMsg];
  res.send({ messages });
}

let sendNoPracticeCallMsg = async ({ query }, res) => {
  let { first_name, last_name, gender, messenger_user_id, practice_id, promo_id } = query;

  let practice = await getPracticeByID(practice_id);
  
  let msg = createNoCallMsg(
    { first_name, last_name, gender, messenger_user_id, practice, promo_id }
  );

  let messages = [msg];
  res.send({ messages });
}

router.get(
  '/user_info',
  handleRoute(askForUserInfo, '[Error] Claiming Promo')
);

router.get(
  '/verify',
  handleRoute(verifyPhoneNumber, '[Error] Verifying Promo')
);

router.get(
  '/verify/code',
  handleRoute(verifyVerificationCode, '[Error] Verifying Promo')
);

router.get(
  '/',
  handleRoute(claimPromotion, '[Error] Claiming Promo')
);

router.get(
  '/no_practice_call',
  handleRoute(sendNoPracticeCallMsg)
);

module.exports = router;