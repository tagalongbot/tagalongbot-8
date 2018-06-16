let { BASEURL } = process.env;
let { createButtonMessage } = require('../../libs/bots.js');
let { createURL } = require('../../libs/helpers.js');

let createFindProvidersMsg = (service) => {
  let service_name = service.fields['Name'];

  let find_providers_btn_url = createURL(
    `${BASEURL}/services/providers`, 
    { service_name }
  );

  let txtMsg = createButtonMessage(
    service.fields['Long Description'].slice(0, 640),
    `Find Providers|json_plugin_url|${find_providers_btn_url}`,
  );
  
  return [txtMsg];
}

let createViewProviderPromosMsg = (service, data) => {
  let service_name = service.fields['Name'];

  let view_provider_promos = createURL(
    `${BASEURL}/services/provider/promos`, 
    data
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