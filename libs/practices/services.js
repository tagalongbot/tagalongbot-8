let { BASEURL } = process.env;

let { createURL } = require('../../libs/helpers.js');
let { createBtn } = require('../../libs/bots.js');

let toGalleryElement = (data) => ({ id: service_id, fields: service }) => {
  let { practice_id, practice_name } = data;

  let title = service['Name'];
  let subtitle = `Service provided by ${decodeURIComponent(practice_name)}`.slice(0, 80);
  let image_url = service['Image URL'];

  let read_description_btn_url = createURL(
    `${BASEURL}/services/description/no`, 
    { service_id, practice_id }
  );

  let btn = createBtn(`Read Description|json_plugin_url|${read_description_btn_url}`);

  let buttons = [btn];

  return { title, subtitle, image_url, buttons };
}

module.exports = {
  toGalleryElement,
}