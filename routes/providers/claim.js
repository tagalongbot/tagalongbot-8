let handleRoute = require('../../middlewares/handleRoute.js');

let express = require('express');
let router = express.Router();

let { sendPhoneVerificationCode, checkVerificationCode } = require('../../libs/twilio.js');
let { getProviderByID } = require('../../libs/data/providers.js');
let { updatePractice, createUpdateMsg } = require('../../libs/providers/claim.js');

let askForUserInfo = async ({ query }, res) => {
  let { provider_id } = query;

  let redirect_to_blocks = ['Ask For User Info (Practice)'];
  let set_attributes = { provider_id };
  res.send({ redirect_to_blocks, set_attributes });
}

let claimProvider = async ({ query }, res) => {
  let { messenger_user_id, provider_id, first_name, user_email } = query;

  let provider = await getProviderByID(provider_id);

  if (!provider) {
    let redirect_to_blocks = ['(Claim) Provider Not Available'];
    res.send({ redirect_to_blocks });
    return;
  }

  let updatedPractice = await updatePractice({ messenger_user_id, user_email, practice: provider });

  let msg = createUpdateMsg({ practice: provider, first_name });

  let messages = [msg];
  res.send({ messages });
}

router.get(
  '/email', 
  handleRoute(askForUserInfo, '[Error] Claiming Provider')
);

router.get(
  '/', 
  handleRoute(claimProvider, '[Error] Claiming Provider')
);

module.exports = router;