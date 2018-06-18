let { localizeDate } = require('../../../../../libs/helpers.js');
let { createPracticePromo } = require('../../../../../libs/data/practice/promos.js');
let { getCustomPromoByID } = require('../../../../../libs/data/custom-promos.js');
let { createExpirationDate } = require('../../../../../libs/admin/promos/create.js');

let createNewPromo = async (data) => {
  let { provider_base_id, new_promo_expiration_date, new_promo_name, new_promo_claim_limit, new_promo_image_id } = data;

  let custom_promo_image = await getCustomPromoByID({ promo_id: new_promo_image_id })
  let new_promo_image = custom_promo_image.fields['Image URL'];

  let expiration_date = createExpirationDate(new_promo_expiration_date);

  let promoData = {
    ['Promotion Name']: new_promo_name,
    ['Type']: 'CUSTOM',
    ['Active?']: true,
    ['Expiration Date']: expiration_date,
    ['Image URL']: new_promo_image,
    ['Claim Limit']: Number(new_promo_claim_limit.trim()),
    ['Total Claim Count']: 0,
  }

  let newPromo = await createPracticePromo(promoData);

  return newPromo;
}

module.exports = {
  createNewPromo,
}