let { createDetailsMsg } = require('../../libs/promos/details.js');
let { getPracticePromo } = require('../../libs/data/practice/promos.js');

let getPromoDetails = async ({ query, params }, res) => {
  let { is_claimed } = params;
  let { provider_id, provider_base_id, promo_id, first_name, last_name, gender, messenger_user_id } = query;

  let promo = await getPracticePromo({ promo_id, provider_base_id });
  console.log('promo', promo);

  let msg = createDetailsMsg(
    promo,
    { provider_id, provider_base_id, promo_id, first_name, last_name, gender, messenger_user_id },
    { is_claimed }
  );

  let messages = [msg];
  res.send({ messages });
}

module.exports = getPromoDetails;