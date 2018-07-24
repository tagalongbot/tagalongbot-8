let { createDetailsMsg } = require('../../libs/promos/details.js');
let { getPracticePromo } = require('../../libs/data/practice/promos.js');

let getPromoDetails = async ({ query, params }, res) => {
  let { is_claimed } = params;
  let { practice_id, practice_promos_base_id, promo_id, first_name, last_name, gender, messenger_user_id } = query;

  let promo = await getPracticePromo(
    { promo_id, practice_promos_base_id }
  );

  let msg = createDetailsMsg(
    { practice_id, practice_promos_base_id, promo, is_claimed, first_name, last_name, gender, messenger_user_id },
  );

  let messages = [msg];
  res.send({ messages });
}

module.exports = getPromoDetails;