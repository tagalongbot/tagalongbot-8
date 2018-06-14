let { getProviderByID } = require('../libs/providers.js');
let { updatePractice, createUpdateMsg } = require('../libs/providers/claim.js');
let express = require('express');
let router = express.Router();

let askForUserEmail = async ({ query }, res) => {
  let { provider_id } = query;

  let redirect_to_blocks = ['Ask For Email (Practice)'];
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

router.get('/email', askForUserEmail);
router.get('/', claimProvider);

module.exports = router;