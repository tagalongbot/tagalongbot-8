let { localizeDate } = require('../../../../libs/helpers.js');
let { createBtn } = require('../../../../libs/bots.js');

let isPromoExpired = (promo_expiration_date) => {
  let date = new Date();

  let promo_date = new Date(promo_expiration_date);

  return date.getMonth() === promo_date.getMonth() && 
    date.getDate() === promo_date.getDate() && 
    date.getFullYear() === promo_date.getFullYear();
}

let toGalleryData = (data) => ({ id: promo_id, fields: promo }) => {
  let { practice_promos_base_id } = data;

  let expiredText = isPromoExpired(promo['Expiration Date']) ? 'EXPIRED' : 'NOT EXPIRED';

  let localized_date = localizeDate(
    new Date(promo['Expiration Date'])
  );

  let title = promo['Promotion Name'];
  let subtitle = `${expiredText} - Valid Until ${localized_date}`;
  let image_url = promo['Image URL'];
  
  let view_promo_details_btn = createBtn(
    `View Promo Details|show_block|[JSON] View Promo Info`,
    { promo_id, practice_promos_base_id }
  );

  let update_promo_btn = createBtn(
    `Update Promo|show_block|Update Promo`,
    { promo_id, practice_promos_base_id }
  );

  let toggle_promo_btn = createBtn(
    `${promo['Active?'] ? 'Deactivate' : 'Reactivate'}|show_block|[JSON] Toggle Promo`,
    { promo_id, practice_promos_base_id }
  );

  let buttons = [view_promo_details_btn, update_promo_btn, toggle_promo_btn];

  return { title, subtitle, image_url, buttons }
}

module.exports = {
  toGalleryData,
}