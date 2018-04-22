let { BASEURL, SERVICES_BASE_ID } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getTable, findTableData } = require('../libs/data');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let findService = findTableData(servicesTable);

let getServiceDescription = async ({ query }, res) => {
  let { service_id, service_name, first_name, last_name, gender, messenger_user_id } = query;
  let data = { service_id, service_name, first_name, last_name, gender, messenger_user_id };

  let service = await findService(service_id);

  let find_providers_btn_url = createURL(`${BASEURL}/service/providers`, data);

  let txtMsg = createButtonMessage(
    service.fields['Long Description'].slice(0, 640),
    `Find Providers|json_plugin_url|${find_providers_btn_url}`,
  );

  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = getServiceDescription;