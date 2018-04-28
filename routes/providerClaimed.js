let { getProviderByUserID } = require('../libs/providers');

let sendProviderClaimedMsg = async ({ query }, res) => {
  let { messenger_user_id } = query;
  let provider = getProviderByUserID(messenger_user_id);
  
  if (provider) {
    let redirect_to_blocks = [];
    r
  }
  
  
}

module.exports = sendProviderClaimedMsg;