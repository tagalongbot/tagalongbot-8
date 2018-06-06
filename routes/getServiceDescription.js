let { BASEURL, SERVICES_BASE_ID } = process.env;
let { createButtonMessage, createTextMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getTable, findTableData } = require('../libs/data');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let findService = findTableData(servicesTable);

let getServiceDescription = async ({ query, params }, res) => {
  let { show_providers } = params;
  let { service_id, service_name } = query;

  let service = await findService(service_id);

  let find_providers_btn_url = createURL(`${BASEURL}/service/providers`, { service_name });

  let messages = [];

  if (show_providers === 'no') {
    let txtMsg = createButtonMessage(
      service.fields['Long Description'].slice(0, 640),
      `Find Providers|json_plugin_url|${find_providers_btn_url}`,
    );
    messages.push(txtMsg);
  } else {
    let txtMsg = createTextMessage(
      service.fields['Long Description'].slice(0, 640),
    );
    messages.push(txtMsg);
  }

  res.send({ messages });
}

module.exports = getServiceDescription;