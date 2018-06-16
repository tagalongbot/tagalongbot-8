// This library is used for manufactured promos inside Services base
let { SERVICES_BASE_ID } = process.env;
let { getTable, getAllDataFromTable, findTableData } = require('../../../libs/data.js');

let getPromosTable = getTable('Manufactured Promos');
let promosTable = getPromosTable(SERVICES_BASE_ID);
let getPromos = getAllDataFromTable(promosTable);

let getManufacturedPromos = async () => {
  let promos = await getPromos();
  return promos;
}

let getManufacturedPromosByService = async ({ service_name }) => {
  let filterByFormula = `{Uppercase Service Name} = '${service_name.toUpperCase()}'`;
  let promos = await getPromos({ filterByFormula });
  return promos;
}

module.exports = {
  getManufacturedPromos,
  getManufacturedPromosByService,
}