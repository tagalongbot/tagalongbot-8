let { BASEURL } = process.env;

let { createURL, localizeDate } = require('../../../../libs/helpers.js');
let { createBtn } = require('../../../../libs/bots.js');

let isPromoExpired = (promo_expiration_date) => {
  let date = new Date();

  let promo_date = new Date(promo_expiration_date);

  return date.getMonth() === promo_date.getMonth() && 
    date.getDate() === promo_date.getDate() && 
    date.getFullYear() === promo_date.getFullYear();
}

// Mapping Functions
let toGalleryData = (data) => ({ id: promo_id, fields: promo }) => {
  let { practice_promos_base_id } = data;

  let expiredText = isPromoExpired(promo['Expiration Date']) ? 'EXPIRED' : 'NOT EXPIRED';

  let localized_date = localizeDate(
    new Date(promo['Expiration Date'])
  );

  let title = promo['Promotion Name'];
  let subtitle = `${expiredText} - Valid Until ${localized_date}`;
  let image_url = promo['Image URL'];

  let view_promo_details_url = createURL(
    `${BASEURL}/admin/promos/view/info`,
    { promo_id, practice_promos_base_id }
  );

  let update_promo_url = createURL(
    `${BASEURL}/admin/promos/update`,
    { promo_id, practice_promos_base_id }
  );

  let toggle_promo_url = createURL(
    `${BASEURL}/admin/promos/toggle`,
    { promo_id, practice_promos_base_id }
  );
  
  let btn1 = createBtn(`View Promo Details|json_plugin_url|${view_promo_details_url}`);
  let btn2 = createBtn(`Update Promo|json_plugin_url|${update_promo_url}`);
  let btn3 = createBtn(`${promo['Active?'] ? 'Deactivate' : 'Reactivate'}|json_plugin_url|${toggle_promo_url}`);

  let buttons = [btn1, btn2, btn3];

  return { title, subtitle, image_url, buttons }
}

module.exports = {
  toGalleryData,
}