let { BASEURL, SERVICES_BASE_ID } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getTable, getAllDataFromTable } = require('../libs/data');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServices = getAllDataFromTable(servicesTable);

let defineProduct = async({ res, parameters, user }) => {
  let { brand_name, procedureorproductcategory } = parameters;

  let filterByFormula = `OR({Capitalized Name} = '${brand_name.trim().toUpperCase()}', {Capitalized Name} = '${procedureorproductcategory.trim().toUpperCase()}')`;
  let [service] = await getServices({ filterByFormula });

  // let service = services.find((service) => {
  //   let serviceName = service.service_name.toLowerCase();
  //   let brandName = brand_name.toLowerCase();
  //   let procedure = procedureorproductcategory.toLowerCase();
  //   return brandName.includes(serviceName) || procedure.includes(serviceName);
  // });

  if (!service) {
    let redirect_to_blocks = ['No Service Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let service_name = service.fields['Name'];
  let find_providers_url = createURL(`${BASEURL}/service/providers`, { service_name });

  let txtMsg = createButtonMessage(
    service.fields['Long Description'],
    `Find Providers|json_plugin_url|${find_providers_url}`
  );

  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = defineProduct;