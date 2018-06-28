let { getPracticeByUserID } = require('../../libs/data/practices.js);

let sendProviderClaimedMsg = async ({ query }, res) => {
  let { messenger_user_id } = query;
  let practice = getPracticeByUserID(messenger_user_id);

  let block_name = (practice) ? 'Practice Already Claimed (By User)' : 'Practice Already Claimed (Not By User)';
  let redirect_to_blocks = [block_name];
  res.send({ redirect_to_blocks });
}

module.exports = sendProviderClaimedMsg;