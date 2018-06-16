let { BASEURL } = process.env;
let { createURL } = require('../../libs/helpers.js');

let toGalleryElement = (data) => ({ id: promo_id, fields: promo }) => {
  let { provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id } = data;

  let title = promo['Promotion Name'];
  let subtitle = promo['Terms'];
  let image_url = promo['Image URL'];

  let promo_details_btn_url = createURL(
    `${BASEURL}/promos/details`, 
    { promo_id, provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id }
  );

  let btn = {
    title: 'View Promo Details',
    type: 'json_plugin_url',
    url: promo_details_btn_url,
  }

  let buttons = [btn];

  let element = { title, subtitle, image_url, buttons };
  return element;
}

module.exports = {
  toGalleryElement,
}