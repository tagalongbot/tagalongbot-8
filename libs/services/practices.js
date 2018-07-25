let { DEFAULT_PROVIDER_IMAGE } = process.env;

let { createBtn } = require('../../libs/bots.js');

let toGalleryElement = (data) => ({ id: practice_id, fields: practice }) => {
  let { service_id } = data;

  let title = practice['Practice Name'].slice(0, 80);
  let subtitle = `${practice['Main Provider']} | ${practice['Practice Address']}`;
  let image_url = practice['Main Provider Image'] ? practice['Main Provider Image'][0].url : DEFAULT_PROVIDER_IMAGE;

  let view_service_promos_btn = createBtn(
    `View Service Promos|show_block|[JSON] Get Service Practice Promos`,
    { service_id, practice_id }
  );

  let buttons = [view_service_promos_btn];

  return { title, subtitle, image_url, buttons };
}

module.exports = {
  toGalleryElement,
}