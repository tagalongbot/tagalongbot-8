let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;
let { createURL } = require('../../libs/helpers.js');

let toGalleryElement = ({ id: service_id, fields: service }) => {
  let surgical_or_non_surgical = service['Surgical / Non Surgical'];
  let non_surgical_category = service[`${surgical_or_non_surgical} Category`];

  let title = service['Name'].slice(0, 80);
  let subtitle = `${surgical_or_non_surgical} | ${non_surgical_category} | ${service[non_surgical_category]}`.slice(0, 80);
  let image_url = service['Image URL'];

  let view_service_details_btn_url = createURL(
    `${BASEURL}/service/description/yes`, 
    { service_id }
  );

  let find_providers_btn_url = createURL(
    `${BASEURL}/service/providers`, 
    { service_id }
  );

  let btn1 = {
    title: 'View Service Details',
    type: 'json_plugin_url',
    url: view_service_details_btn_url,
  }

  let btn2 = {
    title: 'Find Providers',
    type: 'json_plugin_url',
    url: find_providers_btn_url,
  }

  let buttons = [btn1, btn2];

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

  console.log('surgical_category_btn_url', surgical_category_btn_url);
  
  let btn = {
    title: 'View Services',
    type: 'json_plugin_url',
    web: surgical_category_btn_url,
  }

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

  let btn1 = {
    title: 'Load More Services',
    type: 'json_plugin_url',
    url: load_more_services_url,
  }

  let btn2 = {
    title: 'Main Menu',
    type: 'show_block',
    block_name: 'Discover Main Menu',
  }

  let btn3 = {
    title: 'About Bevl Beauty',
    type: 'show_block',
    block_name: 'About Bevl Beauty',
  }

  let buttons = [btn1, btn2, btn3];

  let last_gallery_element = { title, buttons };
  return last_gallery_element;
}

module.exports = {
  toGalleryElement,
  createSurgicalCategoryElement,
  createLastGalleryElement,
}