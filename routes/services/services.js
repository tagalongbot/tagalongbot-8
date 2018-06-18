let { BASEURL, SERVICES_BASE_ID, SURGICAL_SERVICES_IMAGE_URL } = process.env;
let { shuffleArray } = require('../../libs/helpers.js');
let { createGallery } = require('../../libs/bots.js');
let { getProviderByID } = require('../../libs/data/providers.js');
let { getNonSurgicalServices, getSurgicalServices } = require('../../libs/data/services.js');
let { toGalleryElement, createSurgicalCategoryElement, createLastGalleryElement } = require('../../libs/services/services.js');

let getServices = async ({ query, params }, res) => {
  let { service_type } = params;
  let { messenger_user_id, first_name, last_name, gender } = query;

  let index = Number(query['index']) || 0;
  let new_index = index + 8;

  if (service_type === 'surgical') {
    let surgical_services = await getSurgicalServices();
    let surgical_services_gallery_data = surgical_services.map(
      toGalleryElement({ messenger_user_id, first_name, last_name, gender })
    );

    let gallery = createGallery(surgical_services_gallery_data);
    let txtMsg = { text: `Here's are the top surgical services` };
    let messages = [txtMsg, gallery];
    res.send({ messages });
    return;
  }

  let surgical_category_gallery_element = createSurgicalCategoryElement(
    { messenger_user_id, first_name, last_name, gender }
  );

  let non_surgical_services = await getNonSurgicalServices();
  let non_surgical_services_gallery_data = non_surgical_services.slice(index, new_index).map(
    toGalleryElement({ messenger_user_id, first_name, last_name, gender })
  );

  let gallery_array = [surgical_category_gallery_element, ...non_surgical_services_gallery_data];

  if ( new_index < non_surgical_services.length )  {
    let last_gallery_element = createLastGalleryElement({ service_type, index });
    gallery_array.push(last_gallery_element);
  }

  let textMsg = { text: `Here's are some services you can search for ${first_name}` };
	let gallery = createGallery(gallery_array);
	let messages = [textMsg, gallery];
	res.send({ messages });
}

module.exports = getServices;