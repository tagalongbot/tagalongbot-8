let { BASEURL, SERVICES_BASE_ID } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { getTable, findTableData } = require('../libs/data');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let findService = findTableData(servicesTable);

let getServiceDescription = async ({ query }, res) => {
  let { service_id } = query;

  let service = await findService(service_id);

  let txtMsg = createButtonMessage(
    service.fields['Long Description'].slice(0, 640),
    `Find Providers|json_plugin_url|${BASEURL}/service/providers?service_id=${service_id}`
  );

  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = getServiceDescription;