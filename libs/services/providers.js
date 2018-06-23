let { BASEURL, DEFAULT_PROVIDER_IMAGE } = process.env;
let { createBtn } = require('../../libs/bots.js');
let { createURL } = require('../../libs/helpers.js');
let { searchProviders } = require('../../libs/data/providers.js');

let getProviders = async (data) => {
  let { search_type, search_service_providers_state, search_service_providers_city, search_service_providers_zip_code } = data;

  let search_providers_state = search_service_providers_state;
  let search_providers_city = search_service_providers_city;
  let search_providers_zip_code = search_service_providers_zip_code;
  
  let providers = await searchProviders(
    { search_type },
    { search_providers_state, search_providers_city, search_providers_zip_code }
  );
  
  return providers;
}

let toGalleryElement = (data) => ({ id: provider_id, fields: provider }) => {
  let { first_name, last_name, gender, messenger_user_id } = data;

  let title = provider['Practice Name'].slice(0, 80);
  let subtitle = `${provider['Main Provider']} | ${provider['Practice Address']}`;
  let image_url = provider['Main Provider Image'] ? provider['Main Provider Image'][0].url : DEFAULT_PROVIDER_IMAGE;

  let provider_base_id = provider['Practice Base ID'];

  let view_service_promos_url = createURL(
    `${BASEURL}/services/provider/promos`,
    { provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id }
  );

  let btn = createBtn(`View Service Promos|json_plugin_url|${view_service_promos_url}`);

  let buttons = [btn];

  let element = { title, subtitle, image_url, buttons };
  return element;
}

module.exports = {
  getProviders,
}