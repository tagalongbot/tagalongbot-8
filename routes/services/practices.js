let handleRoute = require('../../middlewares/handleRoute.js');

let { shuffleArray } = require('../../libs/helpers.js');
let { createGallery } = require('../../libs/bots.js');

let { getServiceByID } = require('../../libs/data/services.js');
let { searchPractices, sortPractices, filterPracticesByService } = require('../../libs/data/practices.js');

let { toGalleryElement } = require('../../libs/services/practices.js');
let { createLastGalleryElement } = require('../../libs/practices/practices.js');

let express = require('express');
let router = express.Router();

let searchServicePractices = async ({ query }, res) => {
  let { service_id } = query;
  let service = await getServiceByID({ service_id });
  let service_name = service.fields['Name'];

  let set_attributes = { service_id, service_name };
  let redirect_to_blocks = ['Search Service Practices'];
  res.send({ set_attributes, redirect_to_blocks });
}

let getServicePractices = async ({ query, params }, res) => {
  let { messenger_user_id, first_name, last_name, gender, service_id } = query;

  let { zip_code } = params;

  let service = await getServiceByID({ service_id });
  let service_name = service.fields['Name'];

  let practices = await searchPractices(
    { zip_code }
  );

  let practicesByService = (practices[0]) ? filterPracticesByService(service_name, practices) : [];

  if (!practicesByService[0]) {
    let set_attributes = { service_name }
    let redirect_to_blocks = ['No Service Practices Found'];
    res.send({ set_attributes, redirect_to_blocks });
    return;
  }

  let randomPractices = shuffleArray(practicesByService).slice(0, 9).sort(sortPractices).map(
    toGalleryElement({ first_name, last_name, gender, messenger_user_id, service_id })
  );

  let last_gallery_element = createLastGalleryElement();
	let practices_gallery = createGallery([...randomPractices, last_gallery_element], 'square');

  let txtMsg = { text: `Here are some providers I found in Pennsylvania for Facelift` };
  let messages = [txtMsg, practices_gallery];

  res.send({ messages });
}

router.get(
  '/', 
  handleRoute(searchServicePractices, '[Error] User')
);

router.get(
  '/:zip_code',
  handleRoute(getServicePractices, '[Error] User')
);

module.exports = router;