let { BASEURL, SERVICES_BASE_ID } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getTable, findTableData } = require('../libs/data');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let findService = findTableData(servicesTable);

let createFindProvidersMsg = (service) => {
  let service_name = service.fields['Name'];
  let find_providers_btn_url = createURL(`${BASEURL}/service/providers`, { service_name });
  let txtMsg = createButtonMessage(
    service.fields['Long Description'].slice(0, 640),
    `Find Providers|json_plugin_url|${find_providers_btn_url}`,
  );
  
  return [txtMsg];
}

let createViewProviderPromosMsg = (service, data) => {
  let service_name = service.fields['Name'];
  let view_provider_promos = createURL(`${BASEURL}/service/provider/promos`, data);

  let txtMsg = createButtonMessage(
    service.fields['Long Description'].slice(0, 640),
    `View Promos|json_plugin_url|${view_provider_promos}`
  );

  return [txtMsg];
}

let getServiceDescription = async ({ query, params }, res) => {
  let { show_providers } = params;
  let { service_id, provider_id, provider_base_id } = query;

  console.log('provider_base_id', provider_base_id);
  let service = await findService(service_id);

  let messages = (show_providers === 'no') ? createViewProviderPromosMsg(service, query) : createFindProvidersMsg(service);
  res.send({ messages });
}

module.exports = getServiceDescription;