let { BASEURL } = process.env;
let { createGallery } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { searchProviders } = require('../libs/providers');
let { getTable, findTableData } = require('../libs/data');

let express = require('express');
let router = express.Router();

let toGalleryElement = ({ first_name, last_name, gender, messenger_user_id }) => ({ id: provider_id, fields: provider }) => {
  let title = provider['Practice Name'].slice(0, 80);
  let subtitle = `${provider['Main Provider']} | ${provider['Practice Address']}`;
  let image_url = provider['Main Provider Image'][0].url;

  let provider_base_id = provider['Practice Base ID'];
  let provider_name = encodeURIComponent(provider['Practice Name']);
  let data = { provider_id, provider_base_id, provider_name, first_name, last_name, gender, messenger_user_id };
  let view_promos_url = createURL(`${BASEURL}/provider/promos`, data);
  let view_services_url = createURL(`${BASEURL}/provider/services`, data);

  let btn1 = {
    title: 'View Promos',
    type: 'json_plugin_url',
    url: view_promos_url,
  }

  let btn2 = {
    title: 'View Services',
    type: 'json_plugin_url',
    url: view_services_url,
  }

  let buttons = [btn1, btn2];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

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
    return provider['Practice Services']
      .map(service => service.toLowerCase())
      .includes(service_name.toLowerCase());
  });

  if (!filteredProviders[0]) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let providersGalleryData = filteredProviders.map(toGalleryElement({ first_name, last_name, gender, messenger_user_id }));
  let providersGallery = createGallery(providersGalleryData);
  let messages = [providersGallery];
  res.send({ messages });
}

router.get('/providers', searchServiceProviders);
router.get('/providers/:search_type', getServiceProviders);

module.exports = router;