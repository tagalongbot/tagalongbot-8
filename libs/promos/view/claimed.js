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
    { practice_id, practice_promos_base_id, promo_id }
  );

  let view_promo_practice_url = createURL(
    `${BASEURL}/promos/practice`,
    { practice_id, practice_promos_base_id, promo_id }
  );

  let btn1 = createBtn(`View Promo Info|json_plugin_url|${view_promo_details_url}`);
  let btn2 = createBtn(`View Promo Provider|json_plugin_url|${view_promo_practice_url}`);

  let buttons = [btn1, btn2];

  return { title, subtitle, image_url, buttons };
}

module.exports = {
  toGalleryElement,
}