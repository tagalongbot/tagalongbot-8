let { BASEURL } = process.env;

let { createBtn } = require('../../../libs/bots.js');
let { createURL, localizeDate } = require('../../../libs/helpers.js');

let toGalleryElement = (data) => ({ id: promo_id, fields: promo }) => {
  let { user_claimed_promos_data } = data;

  let [practice_id, practice_promos_base_id] = user_claimed_promos_data.find(
    (data) => data.endsWith(promo_id)
  ).split('-');

  let promo_expiration_date = new Date(promo['Expiration Date']);

  let title = promo['Promotion Name'];
  let subtitle = `Promo Expires On ${localizeDate(promo_expiration_date)}`;
  let image_url = promo['Image URL'];

  let view_promo_details_url = createURL(
    `${BASEURL}/promos/details/claimed`,
  );

  let view_promo_details_btn = createBtn(
    `View Promo Details|show_block|[JSON] View Promo Details (Claimed)`,
    { practice_id, practice_promos_base_id, promo_id }
  );

  let view_promo_practice_btn = createBtn(
    `View Promo Practice|show_block|[JSON] View Promo Practice`,
    { practice_id, practice_promos_base_id, promo_id }
  );

  let buttons = [view_promo_details_btn, view_promo_practice_btn];

  return { title, subtitle, image_url, buttons };
}

module.exports = {
  toGalleryElement,
}