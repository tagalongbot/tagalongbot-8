let { SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL, VIEW_MORE_SERVICES_IMAGE_URL } = process.env;

let { createBtn } = require('../../libs/bots.js');

let toGalleryElement = ({ id: service_id, fields: service }) => {
  let surgical_or_non_surgical = service['Surgical / Non Surgical'];
  let non_surgical_category = service[`${surgical_or_non_surgical} Category`];

  let title = service['Name'].slice(0, 80);

  let subtitle = (surgical_or_non_surgical.toLowerCase() === 'surgical') ? 
    `Surgical Service` :
    `Non Surgical | ${non_surgical_category} | ${service[non_surgical_category]}`.slice(0, 80);

  let image_url = service['Image URL'];

  let view_service_details_btn = createBtn(
    `View Service Details|show_block|[JSON] Get Service Description (Show Find Practices Btn)`,
    { service_id }
  );

  let buttons = [view_service_details_btn];

  return { title, subtitle, image_url, buttons};
}

let createSurgicalCategoryElement = () => {
  let title = 'Surgical Procedures';
  let image_url = SURGICAL_SERVICES_IMAGE_URL;

  let surgical_category_btn = createBtn(
    `View Services|show_block|[JSON] Get Surgical Services`
  );

  let buttons = [surgical_category_btn];

  return { title, image_url, buttons };
}

let createLastGalleryElement = ({ service_type, index }) => {
  let title = 'Click Below To View More Services';
  let image_url = VIEW_MORE_SERVICES_IMAGE_URL;
  let new_index = Number(index + 8);

  let load_more_services_btn = createBtn(
    `View More Services|show_block|[JSON] Get More Services`,
    { service_type, index: new_index }
  );

  let main_menu_btn = createBtn(
    `Main Menu|show_block|Main Menu`
  );

  let buttons = [load_more_services_btn, main_menu_btn];

  return { title, image_url, buttons };
}

module.exports = {
  toGalleryElement,
  createSurgicalCategoryElement,
  createLastGalleryElement,
}