let { BASEURL } = process.env;
let { createBtn, createMultiGallery } = require('../../../../libs/bots.js');
let { createURL } = require('../../../../libs/helpers.js');

let createUpdateBtn = (data) => {
  let { provider_base_id, promo_id, user_messenger_id, user_record_id, user_ids } = data;

  if (user_ids.includes(user_record_id)) return null;

  let update_promo_url = createURL(
    `${BASEURL}/admin/promos/user/update`,
    { provider_base_id, promo_id }
  );

  let btn = createBtn(`Mark Promo As Used|json_plugin_url|${update_promo_url}`);

  return btn;
}

let toGalleryElement = ({ provider_base_id, messenger_user_id, user_messenger_id, user_record_id }) => ({ id: promo_id, fields: promo }) => {
  let title = promo['Promotion Name'];
  let subtitle = promo['Terms'];
  let image_url = promo['Image URL'];
  let user_ids = promo['Promo Used By Users'] || [];

  let view_promo_info_url = createURL(
    `${BASEURL}/admin/promos/view/info`,
    { provider_base_id, promo_id, messenger_user_id }
  );

  let btn1 = createBtn(`View Promo Details|json_plugin_url|${view_promo_info_url}`);

  let buttons = [btn1];

  let btn2 = createUpdateBtn(
    { provider_base_id, promo_id, user_messenger_id, user_record_id, user_ids }
  );

  if (btn2) buttons = [btn1, btn2];

  return { title, subtitle, image_url, buttons };
}

module.exports = {
  toGalleryElement,
}