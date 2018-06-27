let { localizeDate } = require('../../../../../libs/helpers.js');
let { createPracticePromo } = require('../../../../../libs/data/practice/promos.js');
let { getCustomImageByID } = require('../../../../../libs/data/custom-images.js');
let { createExpirationDate } = require('../../../../../libs/admin/promos/create.js');

let createNewPromo = async (data) => {
  let { practice_base_id, new_promo_expiration_date, new_promo_name, new_promo_details, new_promo_claim_limit, new_promo_image_id } = data;

  let custom_promo_image = await getCustomImageByID({ custom_image_id: new_promo_image_id })
  let new_promo_image = custom_promo_image.fields['Image URL'];

  let expiration_date = localizeDate(
    createExpirationDate(new_promo_expiration_date)
  );

  let promo_data = {
    ['Promotion Name']: new_promo_name,
    ['Type']: 'CUSTOM',
    ['Active?']: true,
    ['Details']: new_promo_details,
    ['Expiration Date']: expiration_date,
    ['Image URL']: new_promo_image,
    ['Claim Limit']: Number(new_promo_claim_limit.trim()),
    ['Total Claim Count']: 0,
    ['Total Used']: 0,
  }

  let newPromo = await createPracticePromo({ provider_base_id, promo_data });

  return newPromo;
}

module.exports = {
  createNewPromo,
}