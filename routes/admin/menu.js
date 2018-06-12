let { getProviderByUserID } = require('../libs/providers');

let getAdminMenu = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id'];
  
  let provider = await getProviderByUserID(messenger_user_id);
  
  let block_name = (provider && provider.fields['Active?']) ? 'Admin Menu' : 'Non Admin';
  let redirect_to_blocks = [block_name];
  res.send({ redirect_to_blocks });
}

module.exports = getAdminMenu;