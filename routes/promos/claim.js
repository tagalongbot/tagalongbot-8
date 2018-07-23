let handleRoute = require('../../middlewares/handleRoute.js');

let { convertLongTextToArray } = require('../../libs/helpers.js');

let { getPracticeByID } = require('../../libs/data/practices.js');
let { getPracticePromo } = require('../../libs/data/practice/promos.js');
let { getUniqueLead, updatePracticeLead } = require('../../libs/data/practice/leads.js');
let { getUserByMessengerID } = require('../../libs/data/users.js');

let { handleVerifyPhoneNumberRoute, handleVerifyVerificationCode } = require('../../libs/twilio-routes.js');

let { updatePromo, updateClaimedUser, createLead, createClaimedMsg, createNoCallMsg } = require('../../libs/promos/claim.js');

let express = require('express');
let router = express.Router();

let askForUserInfo = async ({ query }, res) => {
  let { promo_id, practice_id } = query;

  let redirect_to_blocks = ['[ROUTER] Claim Promo'];
  let set_attributes = { promo_id, practice_id };
  res.send({ redirect_to_blocks, set_attributes });
}

let verifyPhoneNumber = async ({ query }, res) => {
  let { user_phone_number: phone_number } = query;

  let response = await handleVerifyPhoneNumberRoute(
    { phone_number, block_name: 'Claim Promo' }
  );
  
  res.send(response);
}

let verifyVerificationCode = async ({ query }, res) => {
  let { user_phone_number: phone_number, verification_code } = query;

  let response = await handleVerifyVerificationCode(
    { phone_number, verification_code, block_name: 'Claim Promo' }
  );
  
  res.send(response);
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
    ['Call Initiated ']: 'NO'
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
  '/user_info',
  handleRoute(askForUserInfo, '[Error] User')
);

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
  handleRoute(claimPromotion, '[Error] User')
);

router.get(
  '/no_practice_call',
  handleRoute(sendNoPracticeCallMsg)
);

module.exports = router;