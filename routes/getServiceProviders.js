let { BASEURL } = process.env;
let { createGallery } = require('../libs/bots');
let { createURL, shuffleArray } = require('../libs/helpers');
let { searchProviders, sortProviders, filterProvidersByService, toGalleryElement, createLastGalleryElement } = require('../libs/providers');
let { getTable, findTableData } = require('../libs/data');

let express = require('express');
let router = express.Router();

let searchServiceProviders = async ({ query }, res) => {
  let { service_name } = query;
  let set_attributes = { service_name };
  let redirect_to_blocks = ['Search Service Providers'];
  res.send({ set_attributes, redirect_to_blocks });
}

let getServiceProviders = async ({ query, params }, res) => {
  let { service_name, search_service_providers_state, search_service_providers_city, search_service_providers_zip_code } = query;
  let { search_type } = params;

  let messenger_user_id = query['messenger user id'];
  let first_name = query['first name'];
  let last_name = query['last name'];
  let gender = query['gender'];

  let data = { first_name, last_name, gender, messenger_user_id };

  let providers = await searchProviders({
    search_providers_state: search_service_providers_state,
    search_providers_city: search_service_providers_city,
    search_providers_zip_code: search_service_providers_zip_code,
  }, { search_type });

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

  let randomProviders = shuffleArray(providersByService).slice(0, 9).sort(sortProviders).map(toGalleryElement(data));
  let last_gallery_element = createLastGalleryElement();
	let providersGallery = createGallery([...randomProviders, last_gallery_element]);
  
  let messages = [providersGallery];
  res.send({ messages });
}

router.get('/providers', searchServiceProviders);
router.get('/providers/:search_type', getServiceProviders);

module.exports = router;