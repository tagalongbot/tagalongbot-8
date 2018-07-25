let { localizeDate } = require('../../../../../libs/helpers.js');

let { createPracticePromo } = require('../../../../../libs/data/practice/promos.js');
let { getCustomImageByID } = require('../../../../../libs/data/custom-images.js');
let { createExpirationDate } = require('../../../../../libs/admin/promos/create.js');

let createNewPromo = async (data) => {
  let { practice_promos_base_id, promo_name, promo_details, promo_expiration_date, promo_claim_limit, promo_image_id } = data;

  let custom_promo_image = await getCustomImageByID(
    { custom_image_id: promo_image_id }
  );

  let promo_image = custom_promo_image.fields['Image URL'];

  let expiration_date = localizeDate(
    createExpirationDate(promo_expiration_date)
  );

  let promo_data = {
    ['Promotion Name']: promo_name,
    ['Type']: 'CUSTOM',
    ['Active?']: true,
    ['Details']: promo_details,
    ['Expiration Date']: expiration_date,
    ['Image URL']: promo_image,
    ['Claim Limit']: Number(promo_claim_limit.trim()),
    ['Total Claim Count']: 0,
    ['Total Used']: 0,
  }

  let new_promo = await createPracticePromo(
    { practice_promos_base_id, promo_data }
  );

  return new_promo;
}

module.exports = {
  createNewPromo,
}