let { createDetailsMsg } = require('../../libs/promos/details.js');
let { getPracticePromo } = require('../../libs/practice/promos.js');

let getPromoDetails = async ({ query }, res) => {
  let { provider_id, provider_base_id, promo_id, first_name, last_name, gender1, messenger_user_id } = query;

  let promo = await getPracticePromo({ promo_id, provider_base_id });

  let data = { provider_id, provider_base_id, promo_id, first_name, last_name, gender: gender1, messenger_user_id };
  
  let msg = createDetailsMsg({ data, promo });

  let messages = [msg];
  res.send({ messages });
}

module.exports = getPromoDetails;