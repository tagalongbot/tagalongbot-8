let { SERVICES_BASE_ID } = process.env;

let { getTable, getAllDataFromTable } = require('../../libs/data.js');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServices = getAllDataFromTable(servicesTable);

let getService = async ({ brand_name, procedure }) => {
  let filterByFormula = `OR({Capitalized Name} = '${brand_name.trim().toUpperCase()}', {Capitalized Name} = '${procedure.trim().toUpperCase()}')`;

  let [service] = await getServices({ filterByFormula });
  return service;
}

module.exports = getService;