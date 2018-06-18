let { getProviderByUserID } = require('../../libs/data/providers.js');

let sendProviderClaimedMsg = async ({ query }, res) => {
  let { messenger_user_id } = query;
  let provider = getProviderByUserID(messenger_user_id);

  let block_name = (provider) ? 'Practice Already Claimed (By User)' : 'Practice Already Claimed (Not By User)';
  let redirect_to_blocks = [block_name];
  res.send({ redirect_to_blocks });
}

module.exports = sendProviderClaimedMsg;