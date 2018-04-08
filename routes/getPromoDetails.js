let { createTextMessage } = require('../libs/bots');
let { getActivePromos } = require('../libs/data');

let getPromoDetails = async ({ query }, res) => {
  let { promo_id } = query;

  let activePromos = await getActivePromos();
  let promo = activePromos
    .find((promo) => promo.promoid === Number(promo_id));

  let txtMsg = createTextMessage(promo.promo_details);
  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = getPromoDetails;