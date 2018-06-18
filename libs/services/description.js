let { BASEURL } = process.env;
let { createButtonMessage } = require('../../libs/bots.js');
let { createURL } = require('../../libs/helpers.js');

let createFindProvidersMsg = ({ service, service_id, messenger_user_id, first_name, last_name, gender }) => {
  let find_providers_btn_url = createURL(
    `${BASEURL}/services/providers`, 
    { service_id }
  );

  let find_promos_btn_url = createURL(
    `${BASEURL}/services/promos`,
    { service_id, messenger_user_id, first_name, last_name, gender }
  );

  let txtMsg = createButtonMessage(
    service.fields['Long Description'].slice(0, 640),
    `Find Providers|json_plugin_url|${find_providers_btn_url}`,
  );

  return [txtMsg];
}

let createViewProviderPromosMsg = (service, data) => {
  let { messenger_user_id, first_name, last_name, gender, service_id, provider_id, provider_base_id, provider_name } = data;

  let service_name = service.fields['Name'];

  let view_provider_promos = createURL(
    `${BASEURL}/services/provider/promos`, 
    { messenger_user_id, first_name, last_name, gender, service_id, provider_id, provider_base_id }
  );

  let txtMsg = createButtonMessage(
    service.fields['Long Description'].slice(0, 640),
    `View Promos|json_plugin_url|${view_provider_promos}`
  );

  return [txtMsg];
}

module.exports = {
  createFindProvidersMsg,
  createViewProviderPromosMsg,
}