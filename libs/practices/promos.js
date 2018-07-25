let { LOAD_MORE_PRACTICE_PROMOS_IMAGE_URL } = process.env;

let { createBtn } = require('../../libs/bots.js');

let createLastGalleryElement = ({ index }) => {
  let title = 'More Options';
  let image_url = LOAD_MORE_PRACTICE_PROMOS_IMAGE_URL;
  let new_index = Number(index + 8);

  let load_more_services_btn = createBtn(
    `Load More Promos|show_block|[JSON] Get More Practice Promos`,
    { index: new_index }
  );

  let main_menu_btn = createBtn(
    `Main Menu|show_block|Main Menu`
  );

  let about_bb_btn = createBtn(
    `About Bevl Beauty|show_block|AboutBB`
  );

  let buttons = [load_more_services_btn, main_menu_btn, about_bb_btn];

  return { title, image_url, buttons };
}

module.exports = {
  createLastGalleryElement
}