let handleRoute = require('../../middlewares/handleRoute.js');

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

  let messages = createClaimedMsg(
    { first_name, last_name, gender, messenger_user_id, practice, updated_promo }
  );

  res.send({ messages });
}

let sendNoPracticeCallMsg = async ({ query }, res) => {
  let { first_name, last_name, gender, messenger_user_id, practice_id, promo_id } = query;

  let practice = await getPracticeByID(practice_id);
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];
  let practice_leads_base_id = practice.fields['Practice Leads Base ID'];

  let user = await getUserByMessengerID(messenger_user_id);
  let user_phone_number = user.fields['Phone Number'];

  let promo = await getPracticePromo(
    { practice_promos_base_id, promo_id }
  );

  let promotion_name = promo.fields['Promotion Name'];

  let lead = await getUniqueLead(
    { practice_leads_base_id, user_phone_number, promotion_name }
  );
  
  let lead_data = {
    ['Initiated Call']: 'NO'
  }
  
  let updated_lead = await updatePracticeLead(
    { practice_leads_base_id, lead_data, lead }
  );

  let msg = createNoCallMsg(
    { first_name, last_name, gender, messenger_user_id, practice, promo_id }
  );

  let messages = [msg];
  res.send({ messages });
}

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
  handleRoute(getAdminAccess, '[Error] Claiming Promo')
);

router.get(
  '/no_practice_call',
  handleRoute(sendNoPracticeCallMsg)
);

module.exports = router;