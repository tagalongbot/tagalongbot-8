let handleRoute = require('../../middlewares/handleRoute.js');

let { flattenArray, shuffleArray } = require('../../libs/helpers.js');

let { searchPractices, filterPracticesByService } = require('../../libs/data/practices.js');
let { getPracticePromos } = require('../../libs/data/practice/promos.js');
let { getServiceByID } = require('../../libs/data/services.js');

let { toGalleryElement } = require('../../libs/promos/promos.js');
let { createGallery } = require('../../libs/bots.js');

let express = require('express');
let router = express.Router();

let searchServicePromos = async ({ query }, res) => {
  let { service_id } = query;
  let service = await getServiceByID({ service_id });
  let service_name = service.fields['Name'];

  let set_attributes = { service_id, service_name };
  let redirect_to_blocks = ['Search Service Promos'];
  res.send({ set_attributes, redirect_to_blocks });
}

let getServicePromos = async ({ query }, res) => {
  let { messenger_user_id, first_name, last_name, gender, service_id } = query;
  let { search_service_promos_state: state_name, search_service_promos_city: city_name } = query;

  let service = await getServiceByID({ service_id });
  let service_name = service.fields['Name'];

  let practices = await searchPractices({ state_name, city_name });

  let practices_with_service = (practices[0]) ? filterPracticesByService(service_name, practices) : [];

  let practice_promos = practices_with_service.map(async practice => {
    let practice_id = practice.id;
    let practice_base_id = practice.fields['Practice Base ID'];
    let promos = await getPracticePromos({ practice_base_id });
    return promos.map(
      toGalleryElement({ practice_id, practice_base_id, first_name, last_name, gender, messenger_user_id })
    );
  });

  let promos = flattenArray(
    await Promise.all(practice_promos)
  );

  if (!promos[0]) {
    let set_attributes = { service_name };
    let redirect_to_blocks = ['No Service Promos Found'];
    res.send({ set_attributes, redirect_to_blocks });
    return;
  }

  let randomPromos = shuffleArray(promos).slice(0, 10);

  let txtMsg = { text: `Here are some promos I found in ${state_name} for ${service_name}` };
  let gallery = createGallery(randomPromos, 'square');
  let messages = [txtMsg, gallery];
  res.send({ messages });
}

router.get(
  '/', 
  handleRoute(searchServicePromos, '[Error] Searching Service Promos')
);

router.get(
  '/:search_type', 
  handleRoute(getServicePromos, '[Error] Searching Service Promos')
);

module.exports = router;