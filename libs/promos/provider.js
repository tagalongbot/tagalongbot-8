let { BASEURL } = process.env;
let { createURL } = require('../../libs/helpers.js');

let toGalleryElement = ({ first_name, last_name, gender, messenger_user_id }) => ({ id: provider_id, fields: provider }) => {
  let title = provider['Practice Name'].slice(0, 80);
  let subtitle = `${provider['Main Provider']} | ${provider['Practice Address']}`.slice(0, 80);
  let image_url = provider['Main Provider Image'][0].url;

  let provider_base_id = provider['Practice Base ID'];

  let data = { provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id };
  let promos_btn_url = createURL(`${BASEURL}/providers/promos`, data);
  let services_btn_url = createURL(`${BASEURL}/providers/services`, data);

  let btn1 = {
    title: 'View Promos',
    type: 'json_plugin_url',
    url: promos_btn_url,
  }

  let btn2 = {
    title: 'View Services',
    type: 'json_plugin_url',
    url: services_btn_url,
  }

  let buttons = [btn1, btn2];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

module.exports = {
  toGalleryElement,
}