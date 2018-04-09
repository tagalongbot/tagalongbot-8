let { BASEURL } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { getActivePromos } = require('../libs/data');

let getPromoDetails = async ({ query }, res) => {
  let { promo_id } = query;

  let activePromos = await getActivePromos();
  let promo = activePromos
    .find((promo) => promo.promoid === Number(promo_id));

  let txtMsg = createButtonMessage(
    promo.promo_details,
    `Find Promo Provider|json_plugin_url|${BASEURL}/promo/providers?promo_id=${promo.promoid}`
  );

  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = getPromoDetails;