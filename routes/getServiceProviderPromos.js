let { getTable, getAllDataFromTable } = require('../libs/data');

let getPromosTable = getTable('Promos');

let getPromos = async ({ service_name, provider_base_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let view = 'Active Promos';
  let filterByFormula = `{Type} = '${}'`;
  let promos = await getAllDataFromTable({ view, filterByFormula });
  return promos;
}

let getServiceProviderPromos = async ({ query }, res) => {
  let { service_name, provider_base_id } = query;

  let promos = await getPromos({ service_name, provider_base_id });
}

module.exports = getServiceProviderPromos;