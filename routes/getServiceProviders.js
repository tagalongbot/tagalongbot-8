let { BASEURL, SERVICES_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { searchProviders } = require('../libs/providers');
let { getTable, findTableData } = require('../libs/data');

let express = require('express');
let router = express.Router();

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let findService = findTableData(servicesTable);

let toGalleryElement = ({ id: provider_id, fields: provider }) => {
  let title = provider['Practice Name'].slice(0, 80);
  let subtitle = `${provider['Main Provider']}| ${provider['Practice Address']}`;
  let image_url = provider['Main Provider Image'][0].url;

  let btn1 = {
    title: 'View Promos',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/promos?provider_id=${provider_id}&provider_name=${encodeURIComponent(provider['Practice Name'])}`
  }

  let btn2 = {
    title: 'View Services',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/services?provider_id=${provider_id}&provider_name=${encodeURIComponent(provider['Practice Name'])}`
  }

  let buttons = [btn1, btn2];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

let searchServiceProviders = async ({ query }, res) => {
  let { service_id, service_name } = query;
  let set_attributes = { service_id, service_name };
  let redirect_to_blocks = ['Search Service Providers'];
  res.send({ set_attributes, redirect_to_blocks });
}

let getServiceProviders = async ({ query, params }, res) => {
  let { search_service_providers_state, search_service_providers_city, search_service_providers_zip_code } = query;
  let { search_type } = params;
  let { service_id, service_name } = query;
  
  let service = await findService(service_id);

  let providers = await searchProviders({
    search_providers_state: search_service_providers_state,
    search_providers_city: search_service_providers_city,
    search_providers_zip_code: search_service_providers_zip_code,
  }, search_type);

  if (!providers[0]) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let filteredProviders = providers.filter(({ fields: provider }) => {
    return provider['Practice Services'].includes(service_name);
  });

  if (!filteredProviders[0]) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let providersGalleryData = filteredProviders.map(toGalleryElement);
  let providersGallery = createGallery(providersGalleryData);
  let messages = [providersGallery];
  res.send({ messages });
}

router.get('/providers', searchServiceProviders);
router.get('/providers/:search_type', getServiceProviders);

module.exports = router;