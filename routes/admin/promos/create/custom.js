let { BASEURL } = process.env;
let { createURL, localizeDate } = require('../../../../libs/helpers');
let { getProviderByUserID } = require('../../../../libs/providers');

let { getTable, createTableData } = require('../../../../libs/data');

let getPromosTable = getTable('Promos');

let createCustomPromo = async ({ query }, res) => {
  let { new_promo_name, new_promo_expiration_date, new_promo_claim_limit, new_promo_image } = query;

  let messenger_user_id = query['messenger user id'];
  let provider = await getProviderByUserID(messenger_user_id);

  let provider_base_id = provider.fields['Practice Base ID'];
  let promosTable = getPromosTable(provider_base_id);
  let createPromo = createTableData(promosTable);

  let expiration_date = new Date(new_promo_expiration_date);

  let promoData = {
    ['Promotion Name']: new_promo_name,
    ['Type']: 'CUSTOM',
    ['Active?']: true,
    ['Terms']: `Valid Until ${localizeDate(expiration_date)}`,
    ['Expiration Date']: expiration_date,
    ['Image URL']: new_promo_image,
    ['Claim Limit']: Number(new_promo_claim_limit.trim()),
    ['Total Claim Count']: 0,
  }

  let newPromo = await createPromo(promoData);
  let redirect_to_blocks = ['New Custom Promo Created'];
  res.send({ redirect_to_blocks });
}

module.exports = createCustomPromo;