let { BASEURL, SERVICES_BASE_ID, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { searchProviders } = require('../libs/providers');
let { getTable, findTableData, getAllDataFromTable } = require('../libs/data');

let express = require('express');
let router = express.Router();

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let findService = findTableData(servicesTable);

let getPracticeTable = getTable('Practices');
let practiceTable = getPracticeTable(PRACTICE_DATABASE_BASE_ID);
let getPractices = getAllDataFromTable(practiceTable);

let toGalleryElement = (provider) => {
  let title = provider.practice_name.slice(0, 80);
  let subtitle = `${provider.first_name} ${provider.last_name} | ${provider.address}`;
  let image_url = provider.practice_panel_photo_uri;

  let btn1 = {
    title: 'View Services',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/services?provider_id=${provider.providerid}&provider_name=${encodeURIComponent(provider.practice_name)}`
  }

  let btn2 = {
    title: 'View Promos',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/promos?provider_id=${provider.providerid}&provider_name=${encodeURIComponent(provider.practice_name)}`
  }

  let buttons = [btn1, btn2];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

let searchServiceProviders = async ({ query }, res) => {
  let { service_id } = query;
  let set_attributes = { service_id: service_id };
  let redirect_to_blocks = ['Search Service Providers'];
  res.send({ set_attributes, redirect_to_blocks });
}

let getServiceProviders = async ({ query, params }, res) => {
  let { search_service_providers_state, search_service_providers_city, search_service_providers_zip_code } = query;
  let { search_type } = params;
  let { service_id } = query;

  let service = await findService(params['service_id']);

  let providers = await searchProviders({
    search_providers_state: search_service_providers_state || null,
    search_providers_city: search_service_providers_city || null,
    search_providers_zip_code: search_service_providers_zip_code || null,
  });

  if (!providers[0]) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let providersGalleryData = providers.map(toGalleryElement);
  let providersGallery = createGallery(providersGalleryData);
  let messages = [providersGallery];
  res.send({ messages });
}

router.get('/providers', searchServiceProviders);
router.get('/providers/:service_id', getServiceProviders);

module.exports = router;