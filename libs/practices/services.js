let { createBtn } = require('../../libs/bots.js');

let toGalleryElement = (data) => ({ id: service_id, fields: service }) => {
  let { practice_id, practice_name } = data;

  let title = service['Name'];
  let subtitle = `Service provided by ${decodeURIComponent(practice_name)}`.slice(0, 80);
  let image_url = service['Image URL'];

  let read_description_btn = createBtn(
    `Read Description|show_block|[JSON] Get Service Description`,
    { service_id, practice_id }
  );

  let buttons = [read_description_btn];

  return { title, subtitle, image_url, buttons };
}

module.exports = {
  toGalleryElement,
}