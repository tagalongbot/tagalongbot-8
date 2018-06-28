let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;
let { createURL } = require('../../libs/helpers.js');
let { createBtn } = require('../../libs/bots.js');

let toGalleryElement = (data) => ({ id: service_id, fields: service }) => {
  let { messenger_user_id, first_name, last_name, gender } = data;

  let surgical_or_non_surgical = service['Surgical / Non Surgical'];
  let non_surgical_category = service[`${surgical_or_non_surgical} Category`];

  let title = service['Name'].slice(0, 80);
  let subtitle = (surgical_or_non_surgical.toLowerCase() === 'non surgical') ? 
      `Non Surgical | ${non_surgical_category} | ${service[non_surgical_category]}`.slice(0, 80) : 
      `Surgical Service`;

  let image_url = service['Image URL'];

  let view_service_details_btn_url = createURL(
    `${BASEURL}/services/description/yes`,
    { service_id, messenger_user_id, first_name, last_name, gender }
  );

  let find_practices_btn_url = createURL(
    `${BASEURL}/services/providers`,
    { service_id, messenger_user_id, first_name, last_name, gender }
  );
  
  let find_promos_btn_url = createURL(
    `${BASEURL}/services/promos`,
    { service_id, messenger_user_id, first_name, last_name, gender }
  );

  let btn1 = createBtn(`View Service Details|json_plugin_url|${view_service_details_btn_url}`);
  let btn2 = createBtn(`Find Providers|json_plugin_url|${find_practices_btn_url}`);
  let btn3 = createBtn(`Find Promos|json_plugin_url|${find_promos_btn_url}`);

  let buttons = [btn1, btn2, btn3];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

let createSurgicalCategoryElement = (data) => {
  let { messenger_user_id, first_name, last_name, gender } = data;
  let title = 'Surgical Procedures';
  let image_url = SURGICAL_SERVICES_IMAGE_URL;

  let surgical_category_btn_url = createURL(
    `${BASEURL}/services/search/surgical`,
    { messenger_user_id, first_name, last_name, gender }
  );
  
  let btn = createBtn(`View Services|json_plugin_url|${surgical_category_btn_url}`);

  let buttons = [btn];

  let surgical_category_gallery_element = { title, image_url, buttons };
  return surgical_category_gallery_element;
}

let createLastGalleryElement = ({ service_type, index }) => {
  let title = 'More Options';
  let new_index = Number(index + 8);

  let load_more_services_url = createURL(
    `${BASEURL}/services/search/${service_type}`, 
    { index: new_index }
  );
  
  let btn1 = createBtn(`Load More Services|json_plugin_url|${load_more_services_url}`);
  let btn2 = createBtn(`Main Menu|show_block|Discover Main Menu`);
  let btn3 = createBtn(`About Bevl Beauty|show_block|About Bevl Beauty`);

  let buttons = [btn1, btn2, btn3];

  let last_gallery_element = { title, buttons };
  return last_gallery_element;
}

module.exports = {
  toGalleryElement,
  createSurgicalCategoryElement,
  createLastGalleryElement,
}