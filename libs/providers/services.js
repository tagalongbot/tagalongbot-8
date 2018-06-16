let { BASEURL } = process.env;
let { createURL } = require('../../libs/helpers.js');

let toGalleryElement = (data) => ({ id: service_id, fields: service }) => {
  let title = service['Name'];
  let subtitle = `Service provided by ${decodeURIComponent(data.provider_name)}`.slice(0, 80);
  let image_url = service['Image URL'];

  let service_name = encodeURIComponent(service['Name']);
  let read_description_btn_url = createURL(`${BASEURL}/services/description/no`, { service_id, service_name, ...data });
  let btn = {
    title: 'Read Description',
    type: 'json_plugin_url',
    url: read_description_btn_url,
  }

  let buttons = [btn];

  let element = { title, subtitle, image_url, buttons };
  return element;
}

module.exports = {
  toGalleryElement,
}