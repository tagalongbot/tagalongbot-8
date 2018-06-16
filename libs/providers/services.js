let { BASEURL } = process.env;
let { createURL } = require('../../libs/helpers.js');
let { createBtn } = require('../../libs/bots.js');

let toGalleryElement = (data) => ({ id: service_id, fields: service }) => {
  let { messenger_user_id, first_name, last_name, gender, provider_id, provider_base_id, provider_name } = data;

  let title = service['Name'];
  let subtitle = `Service provided by ${decodeURIComponent(provider_name)}`.slice(0, 80);
  let image_url = service['Image URL'];

  let read_description_btn_url = createURL(
    `${BASEURL}/services/description/no`, 
    { service_id, messenger_user_id, first_name, last_name, gender, provider_id, provider_base_id }
  );

  let btn = createBtn(`Read Description|json_plugin_url|${read_description_btn_url}`);

  let buttons = [btn];

  let element = { title, subtitle, image_url, buttons };
  return element;
}

module.exports = {
  toGalleryElement,
}