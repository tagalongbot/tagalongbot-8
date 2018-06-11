let { BASEURL } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getTable, findTableData } = require('../libs/data');

let getPromosTable = getTable('Promos');

let getPromo = async ({ promo_id, provider_base_id }) => {
  let promoTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promoTable);
  let promo = await findPromo(promo_id);
  return promo;
}

let getPromoDetails = async ({ query }, res) => {
  let { provider_id, provider_base_id, promo_id, first_name, last_name, gender1, messenger_user_id } = query;

  let promo = await getPromo({ promo_id, provider_base_id });

  let data = { provider_id, provider_base_id, promo_id, first_name, last_name, gender: gender1, messenger_user_id };
  let claim_promo_url = createURL(`${BASEURL}/promo/claim/email`, { provider_id, promo_id });
  let view_provider_url = createURL(`${BASEURL}/promo/provider`, data);

  let txtMsg = createButtonMessage(
    promo.fields['Details'],
    `Claim Promotion|json_plugin_url|${claim_promo_url}`,
    `View Promo Provider|json_plugin_url|${view_provider_url}`,
  );

  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = getPromoDetails;