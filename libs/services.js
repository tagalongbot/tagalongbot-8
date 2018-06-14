let { SERVICES_BASE_ID } = process.env;
let { getTable, getAllDataFromTable, findTableData } = require('../../libs/data.js');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServices = getAllDataFromTable(servicesTable);
let findService = findTableData(servicesTable);

let searchSurgicalNonSurgicalServices = async (surgical_or_non_surgical) => {
	let filterByFormula = `{Surgical / Non Surgical} = '${surgical_or_non_surgical}'`;
  let services = await getServices({ filterByFormula });
  return services;
}

let filterServicesFromProvider = ({ services, provider }) => {
  let toLowerCase = data => data.toLowerCase();

  let services_from_provider = services.filter(
    (service) => provider.fields['Practice Services'].map(toLowerCase).includes(service.fields['Name'].toLowerCase())
  );

  return services_from_provider;
}

module.exports = {
  getServices,
  findService,
  searchSurgicalNonSurgicalServices,
  filterServicesFromProvider
}