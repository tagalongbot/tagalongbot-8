let { createDetailsMsg } = require('../../libs/promos/details.js');
let { getPracticePromo } = require('../../libs/data/practice/promos.js');

let getPromoDetails = async ({ query }, res) => {
  let { provider_id, provider_base_id, promo_id, first_name, last_name, gender, messenger_user_id } = query;

  console.log('promo_id', promo_id);
  let promo = await getPracticePromo({ promo_id, provider_base_id });

  let msg = createDetailsMsg(
    promo,
    { provider_id, provider_base_id, promo_id, first_name, last_name, gender, messenger_user_id }
  );

  let messages = [msg];
  res.send({ messages });
}

module.exports = getPromoDetails;