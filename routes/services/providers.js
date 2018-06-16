let { shuffleArray } = require('../../libs/helpers.js');
let { createGallery } = require('../../libs/bots.js');
let { findService } = require('../../libs/services.js');
let { sortProviders, filterProvidersByService } = require('../../libs/providers.js');
let { getProviders } = require('../../libs/services/providers.js');
let { toGalleryElement, createLastGalleryElement } = require('../../libs/providers/providers.js');

let express = require('express');
let router = express.Router();

let searchServiceProviders = async ({ query }, res) => {
  let { service_id } = query;
  let set_attributes = { service_id };
  let redirect_to_blocks = ['Search Service Providers'];
  res.send({ set_attributes, redirect_to_blocks });
}

let getServiceProviders = async ({ query, params }, res) => {
  let { search_type } = params;

  let { messenger_user_id, first_name, last_name, gender } = query;
  let { service_id, search_service_providers_state, search_service_providers_city, search_service_providers_zip_code } = query;

  let service = await findService(service_id);
  let service_name = service.fields['Name'];

  let providers = await getProviders(
    { search_type, search_service_providers_state, search_service_providers_city, search_service_providers_zip_code }
  );

  if (!providers[0]) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let providersByService = filterProvidersByService(service_name, providers);

  if (!providersByService[0]) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let randomProviders = shuffleArray(providersByService).slice(0, 9).sort(sortProviders).map(
    toGalleryElement({ first_name, last_name, gender, messenger_user_id })
  );

  let last_gallery_element = createLastGalleryElement();
	let providersGallery = createGallery([...randomProviders, last_gallery_element]);
  let messages = [providersGallery];
  res.send({ messages });
}

router.get('/', searchServiceProviders);
router.get('/:search_type', getServiceProviders);

module.exports = router;