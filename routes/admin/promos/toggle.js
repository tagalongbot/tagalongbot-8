let { getProviderByUserID } = require('../../../libs/providers.js');
let { getPromo, updatePromo, createUpdateMsg } = require('../../../libs/admin/promos/toggle.js');

let togglePromo = async ({ query }, res) => {
  let { promo_id, provider_base_id } = query;
  let messenger_user_id = query['messenger user id'];

  let provider = await getProviderByUserID(messenger_user_id);
  let promo = await getPromo({ provider_base_id, promo_id });
  let updatedPromo = await updatePromo({ provider_base_id, promo });
  
  let updateMsg = createUpdateMsg({ messenger_user_id, promo_id, provider_base_id, promo, updatedPromo });

  let messages = [updateMsg];
  res.send({ messages });
}

module.exports = togglePromo;