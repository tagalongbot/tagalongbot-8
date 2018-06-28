let { getPracticeByUserID } = require('../../../libs/data/practices.js);
let { getPromo, updatePromo, createUpdateMsg } = require('../../../libs/admin/promos/toggle.js');

let togglePromo = async ({ query }, res) => {
  let { messenger_user_id, promo_id, practice_base_id } = query;

  let practice = await getProviderByUserID(messenger_user_id);
  let promo = await getPromo({ provider_base_id, promo_id });
  let updatedPromo = await updatePromo({ provider_base_id, promo });
  
  let updateMsg = createUpdateMsg({ messenger_user_id, promo_id, practice_base_id, promo, updatedPromo });

  let messages = [updateMsg];
  res.send({ messages });
}

module.exports = togglePromo;