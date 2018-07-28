let { localizeDate } = require('../../../../libs/helpers.js');
let { createBtn } = require('../../../../libs/bots.js');
let { createExpirationDate } = require('../../../../libs/admin/promos/create.js');
let { createPracticePromo } = require('../../../../libs/data/practice/promos.js');
let { getCustomImageByID } = require('../../../../libs/data/custom-images.js');

let toCategoryGallery = (data) => ({ id: category_id, fields: category }) => {
  let { new_promo_name, new_promo_expiration_date } = data;

  let title = category['Category Name'];
  let image_url = category['Image URL'];

  let btn1 = createBtn(
    `View Category Images|show_block|[JSON] View Category Images (Custom Promo)`,
    { category_id, new_promo_name, new_promo_expiration_date }
  );

  let buttons = [btn1];

  return { title, image_url, buttons };
}

let toImagesGallery = (data) => ({ id: promo_id, fields: promo_image }) => {
  let { new_promo_name, new_promo_expiration_date } = data;

  let expiration_date = localizeDate(
    createExpirationDate(new_promo_expiration_date)
  );

  let title = new_promo_name;
  let subtitle = `Valid Until ${expiration_date}`;
  let image_url = promo_image['Image URL'];
  let new_promo_image_id = promo_id;

  let btn1 = createBtn(
    `Use This Image|show_block|[JSON] Select Image (Custom Promo)`,
    { new_promo_image_id }
  );

  let buttons = [btn1];

  return { title, subtitle, image_url, buttons };
}

let createNewPromo = async (data) => {
  let {
    practice_promos_base_id, 
    promo_name,
    promo_details,
    promo_expiration_date,
    promo_claim_limit,
    promo_image_id
  } = data;

  let custom_promo_image = await getCustomImageByID(
    { custom_image_id: promo_image_id }
  );

  let promo_image = custom_promo_image.fields['Image URL'];

  let promo_data = {
    ['Promotion Name']: promo_name,
    ['Type']: 'CUSTOM',
    ['Active?']: true,
    ['Details']: promo_details,
    ['Expiration Date']: promo_expiration_date,
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
  toCategoryGallery,
  toImagesGallery,
  createNewPromo
}