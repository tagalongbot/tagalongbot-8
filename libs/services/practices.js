let { BASEURL, DEFAULT_PROVIDER_IMAGE } = process.env;

let { createBtn } = require('../../libs/bots.js');
let { createURL } = require('../../libs/helpers.js');

let toGalleryElement = (data) => ({ id: practice_id, fields: practice }) => {
  let { service_id } = data;

  let title = practice['Practice Name'].slice(0, 80);
  let subtitle = `${practice['Main Provider']} | ${practice['Practice Address']}`;
  let image_url = practice['Main Provider Image'] ? practice['Main Provider Image'][0].url : DEFAULT_PROVIDER_IMAGE;

  let view_service_promos_url = createURL(
    `${BASEURL}/services/practice/promos`,
    { practice_id }
    // { service_id, practice_id } // Chatfuel bug already sending "service_id"
  );

  let btn = createBtn(`View Service Promos|json_plugin_url|${view_service_promos_url}`);

  let buttons = [btn];

  let element = { title, subtitle, image_url, buttons };
  return element;
}

module.exports = {
  toGalleryElement,
}