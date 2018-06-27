let { getPracticePromo } = require('../../../../libs/data/practice/promos.js');
let { createPromoMsg } = require('../../../../libs/admin/promos/view/info.js');

let viewPromoInfo = async ({ query }, res) => {
  let { messenger_user_id, promo_id, practice_base_id } = query;

  let promo = await getPracticePromo({ promo_id, provider_base_id });

  let promoMsg = createPromoMsg(
    promo,
    { practice_base_id, messenger_user_id }, 
  );

  let messages = [promoMsg];
  res.send({ messages });
}

module.exports = viewPromoInfo;