let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;

let { shuffleArray } = require('../../libs/helpers.js');
let { createGallery } = require('../../libs/bots.js');

let { getPracticeByID } = require('../../libs/data/practices.js');
let { getNonSurgicalServices, getSurgicalServices } = require('../../libs/data/services.js');

let { toGalleryElement, createSurgicalCategoryElement, createLastGalleryElement } = require('../../libs/services/services.js');

// Refactor code to be more declarative
let getServices = async ({ query, params }, res) => {
  let { service_type } = params;

  let index = Number(query['index']) || 0;
  let new_index = index + 8;

  if (service_type === 'surgical') {
    let surgical_services = await getSurgicalServices();

    let surgical_services_gallery_data = surgical_services.map(
      toGalleryElement
    );

    let messages = [
      { text: `Here's are the top surgical services` }, 
      createGallery(surgical_services_gallery_data)
    ];

    res.send({ messages });
    return;
  }

  let surgical_category_gallery_element = createSurgicalCategoryElement();

  let non_surgical_services = await getNonSurgicalServices();
  let non_surgical_services_gallery_data = non_surgical_services.slice(index, new_index).map(
    toGalleryElement
  );

  let gallery_array = [surgical_category_gallery_element, ...non_surgical_services_gallery_data];

  // Add Load More option
  if ( new_index < non_surgical_services.length )  {
    let last_gallery_element = createLastGalleryElement(
      { service_type, index }
    );

    gallery_array.push(last_gallery_element);
  }

	let messages = [
    { text: `Here's are some services you can search for` }, 
    createGallery(gallery_array)  
  ];

	res.send({ messages });
}

module.exports = getServices;