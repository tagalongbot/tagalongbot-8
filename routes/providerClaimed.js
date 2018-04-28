let { getProviderByUserID } = require('../libs/providers');

let sendProviderClaimedMsg = async ({ query }, res) => {
  let { messenger_user_id } = query;
  let provider = getProviderByUserID(messenger_user_id);
  
  let redirect_to_blocks = [];

  if (provider) {
    redirect_to_blocks.push('Practice Already Claimed (By User)');
  }
  
  redirect_to_blocks.push('Practice Already Claimed (Not By User)');

  res.send({ redirect_to_blocks });
}

module.exports = sendProviderClaimedMsg;