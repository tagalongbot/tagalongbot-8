let { localizeDate } = require('../../../../libs/helpers.js');
let { createBtn } = require('../../../../libs/bots.js');
let { createExpirationDate } = require('../../../../libs/admin/promos/create.js');

let toCategoryGallery = (data) => ({ id: category_id, fields: category }) => {
  let { messenger_user_id, promo_name, promo_expiration_date, promo_claim_limit } = data;

  let title = category['Category Name'];
  let image_url = category['Image URL'];

  let btn1 = createBtn(
    `View Category Images|show_block|[JSON] View Category Images (Custom Promo)`,
    { category_id }
  );

  let buttons = [btn1];

  return { title, image_url, buttons };
}

let toImagesGallery = (data) => ({ id: promo_id, fields: promo_image }) => {
  let { promo_name, promo_expiration_date } = data;

  let expiration_date = localizeDate(
    createExpirationDate(promo_expiration_date)
  );

  let title = promo_name;
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

module.exports = {
  toCategoryGallery,
  toImagesGallery,
}