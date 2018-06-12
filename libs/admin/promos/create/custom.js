let { localizeDate } = require('../../../helpers.js');
let { getTable, createTableData } = require('../../../data.js');

let getPromosTable = getTable('Promos');

let createNewPromo = async (data) => {
  let { provider_base_id, new_promo_expiration_date, new_promo_name, new_promo_image, new_promo_claim_limit } = data;
  
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

  return newPromo;
}

module.exports = {
  createNewPromo,
}