let { getPracticeByUserID } = require('../../../libs/data/practices.js');
let { getPracticePromo } = require('../../../libs/data/practice/promos.js');
let { updatePromo, createUpdateMsg } = require('../../../libs/admin/promos/toggle.js');

let togglePromo = async ({ query }, res) => {
  let { messenger_user_id, promo_id, practice_promos_base_id } = query;

  let practice = await getPracticeByUserID(messenger_user_id);

  let promo = await getPracticePromo(
    { practice_promos_base_id, promo_id }
  );

  let updated_promo = await updatePromo(
    { practice_promos_base_id, promo }
  );

  let updateMsg = createUpdateMsg(
    { promo_id, practice_promos_base_id, promo, updated_promo }
  );

  let messages = [updateMsg];
  res.send({ messages });
}

module.exports = togglePromo;