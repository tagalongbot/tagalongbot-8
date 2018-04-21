let { BASEURL } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { getTable, findTableData } = require('../libs/data');

// Get Tables
let getPromosTable = getTable('Promos');

// Search Methods
let getPromo = async ({ promo_id, promo_base_id }) => {
  let promoTable = getPromosTable(promo_base_id);
  let findPromo = findTableData(promoTable);
  let promo = await findPromo(promo_id);
  return promo;
}

let getPromoDetails = async ({ query }, res) => {
  let { promo_id, promo_base_id, promo_type } = query;

  let promo = await getPromo({ promo_id, promo_base_id });
  
  let txtMsg = createButtonMessage(
    promo.fields['Details'],
    `Find Promo Provider|json_plugin_url|${BASEURL}/promo/providers?promo_id=${promo.promoid}&promo_base_id=${promo_base_id}&promo_type=${promo_type}`
  );

  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = getPromoDetails;