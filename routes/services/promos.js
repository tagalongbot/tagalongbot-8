let handleRoute = require('../../middlewares/handleRoute.js');

let { flattenArray, shuffleArray } = require('../../libs/helpers.js');
let { getServiceByID } = require('../../libs/data/services.js');
let { getProviders } = require('../../libs/services/promos.js');
let { filterProvidersByService } = require('../../libs/data/providers.js');
let { getPracticePromos } = require('../../libs/data/practice/promos.js');
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

let getServicePromos = async ({ query, params }, res) => {
  let { search_type } = params;

  let { messenger_user_id, first_name, last_name, gender } = query;
  let { service_id, search_service_promos_state, search_service_promos_city, search_service_promos_zip_code } = query;

  let service = await getServiceByID({ service_id });
  let service_name = service.fields['Name'];

  let practices = await getProviders(
    { search_type, search_service_promos_state, search_service_promos_city, search_service_promos_zip_code }
  );

  let providers_with_service = (practices[0]) ? filterProvidersByService(service_name, practices) : [];

  let provider_promos = providers_with_service.map(async practice => {
    let practice_id = practice.id;
    let practice_base_id = practice.fields['Practice Base ID'];
    let promos = await getPracticePromos({ provider_base_id });
    return promos.map(
      toGalleryElement({ practice_id, practice_base_id, first_name, last_name, gender, messenger_user_id })
    );
  });

  let promos = flattenArray(
    await Promise.all(provider_promos)
  );

  if (!promos[0]) {
    let set_attributes = { service_name }
    let redirect_to_blocks = ['No Service Promos Found'];
    res.send({ set_attributes, redirect_to_blocks });
    return;
  }

  let randomPromos = shuffleArray(promos).slice(0, 10);

  let txtMsg = { text: `Here are some promos I found in Pennsylvania for Facelift` };
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