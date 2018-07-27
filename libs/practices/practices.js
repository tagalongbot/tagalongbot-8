let { DEFAULT_PRACTICE_IMAGE, LIST_YOUR_PRACTICE_IMAGE_URL } = process.env;

let { createBtn } = require('../../libs/bots.js');

let toGalleryElement = ({ id: practice_id, fields: practice }) => {
  let title = practice['Practice Name'].slice(0, 80);
  let subtitle = `${practice['Main Provider']} | ${practice['Practice Address']}`;
  
  let image_url = practice['Main Provider Image'] ?
    practice['Main Provider Image'][0].url :
    DEFAULT_PRACTICE_IMAGE;
  
  let view_services_btn = createBtn(
    `View Services|show_block|[JSON] Get Practice Services`,
    { practice_id }
  );

  let view_promos_btn = createBtn(
    `View Promos|show_block|[JSON] Get Practice Promos`,
    { practice_id }  
  );

  let buttons = [view_services_btn, view_promos_btn];

  return { title, subtitle, image_url, buttons };
}

let createLastGalleryElement = () => {
  let title = 'List Your Practice';
  let image_url = LIST_YOUR_PRACTICE_IMAGE_URL;

  let btn1 = createBtn(`List My Practice|show_block|[JSON] List Practice Route`);
  let btn2 = createBtn(`Main Menu|show_block|Main Menu`);
  let btn3 = createBtn(`About Bevl Beauty|show_block|AboutBB`);

  let buttons = [btn1, btn2, btn3];

  return { title, image_url, buttons };
}

module.exports = {
  toGalleryElement,
  createLastGalleryElement,
}