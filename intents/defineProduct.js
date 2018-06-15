let { BASEURL, SERVICES_BASE_ID } = process.env;
let { createButtonMessage } = require('../libs/bots.js');
let { createURL } = require('../libs/helpers.js');
let { getTable, getAllDataFromTable } = require('../libs/data.js');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServices = getAllDataFromTable(servicesTable);

let defineProduct = async({ res, parameters, user }) => {
  let { brand_name, procedure } = parameters;

  let filterByFormula = `OR({Capitalized Name} = '${brand_name.trim().toUpperCase()}', {Capitalized Name} = '${procedure.trim().toUpperCase()}')`;
  let [service] = await getServices({ filterByFormula });

  if (!service) {
    let redirect_to_blocks = ['No Service Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let service_name = service.fields['Name'];
  let find_providers_url = createURL(`${BASEURL}/service/providers`, { service_name });

  // Add a way to find promos by service
  let txtMsg = createButtonMessage(
    service.fields['Long Description'],
    `Find Providers|json_plugin_url|${find_providers_url}`
  );

  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = defineProduct;