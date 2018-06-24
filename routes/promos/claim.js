let handleRoute = require('../../middlewares/handleRoute.js');

let express = require('express');
let router = express.Router();

let { getProviderByID } = require('../../libs/data/providers.js');
let { getPracticePromo } = require('../../libs/data/practice/promos.js');
let { updatePromo, createOrUpdateUser, createClaimedMsg } = require('../../libs/promos/claim.js');

let { sendPhoneVerificationCode, checkVerificationCode } = require('../../libs/twilio.js');

let askForUserInfo = async ({ query }, res) => {
  let { promo_id, provider_id } = query;

  let redirect_to_blocks = ['Ask For User Info (Promo)'];
  let set_attributes = { promo_id, provider_id };
  res.send({ redirect_to_blocks, set_attributes });
}

let verifyPhoneNumber = async ({ query }, res) => {
  let { user_phone_number: phone_number } = query;
  let sent_verification_code = await sendPhoneVerificationCode({ phone_number });

  let redirect_to_blocks = ['Verify Phone Number (Claim Promo)'];
  res.send({ redirect_to_blocks });
}

let verifyVerificationCode = async ({ query }, res) => {
  let { verification_code } = query;

  let sent_verification_code = await checkVerificationCode({ verification_code });
  console.log('sent_verification_code', sent_verification_code);

  let redirect_to_blocks = ['Correct Verification Code (Claim Promo)'];
  res.send({ redirect_to_blocks });
}

let claimPromotion = async ({ query }, res) => {
  let { messenger_user_id, first_name, last_name, promo_id,  provider_id, gender, user_email } = query;

  let provider = await getProviderByID(provider_id);
  let provider_base_id = provider.fields['Practice Base ID'];
  let provider_phone_number = provider.fields['Practice Phone #'];
  let provider_booking_url = provider.fields['Practice Booking URL'];

  let promo = await getPracticePromo({ provider_base_id, promo_id });

  if (!promo || promo.fields['Claim Limit Reached'] === '1') {
    let redirect_to_blocks = ['Promo No Longer Valid'];
    res.send({ redirect_to_blocks });
    return;
  }

  let user_data = { messenger_user_id, first_name, last_name, gender, user_email };
  let user = await createOrUpdateUser(user_data, provider);

  let claimed_by_users = promo.fields['Claimed By Users'] || [];

  if (claimed_by_users.includes(user.id)) {
    let redirect_to_blocks = ['Promo Already Claimed By User'];
    res.send({ redirect_to_blocks });
    return;
  }

  let updated_promo = await updatePromo({ provider_base_id, promo, user, claimed_by_users });

  let data = { provider_id, provider_base_id, promo_id, first_name, last_name, gender, messenger_user_id };

  let claimedMsg = createClaimedMsg({ data, updated_promo, provider_phone_number, provider_booking_url });

  let messages = [claimedMsg];
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

module.exports = router;