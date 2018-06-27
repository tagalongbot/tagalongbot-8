let { SERVICES_BASE_ID } = process.env;
let { getTable, getAllDataFromTable, findTableData } = require('../../libs/data.js');

let getServicesTable = getTable('Services');
let servicesTable = getServicesTable(SERVICES_BASE_ID);
let getServices = getAllDataFromTable(servicesTable);
let findService = findTableData(servicesTable);

let getServiceByID = async ({ service_id }) => {
  let service = await findService(service_id);
  return service;
}

let getAllServices = async () => {
  let services = await getServices();
  return services;  
}

let getNonSurgicalServices = async () => {
  let filterByFormula = `{Surgical / Non Surgical} = 'Non Surgical'`;
  let services = await getServices({ filterByFormula });
  return services;
}

let getSurgicalServices = async () => {
	let filterByFormula = `{Surgical / Non Surgical} = 'Surgical'`;
  let services = await getServices({ filterByFormula });
  return services;
}

let filterServicesFromProvider = ({ services, practice }) => {
  let toLowerCase = data => data.toLowerCase();

  let services_from_provider = services.filter(
    (service) => practice.fields['Practice Services'].map(toLowerCase).includes(service.fields['Name'].toLowerCase())
  );

  return services_from_provider;
}

module.exports = {
  getServiceByID,
  getAllServices,
  getNonSurgicalServices,
  getSurgicalServices,
  filterServicesFromProvider,
}