// This library is used for Custom Promos inside Services base
let { SERVICES_BASE_ID } = process.env;
let { getTable, getAllDataFromTable, findTableData } = require('../../libs/data.js');

let getPromosTable = getTable('Custom Promos');
let promosTable = getPromosTable(SERVICES_BASE_ID);
let getPromos = getAllDataFromTable(promosTable);
let findPromo = findTableData(promosTable);

let getCustomPromos = async () => {
  let promos = await getPromos();
  return promos;
}

let getCustomPromosByCategory = async ({ service_name }) => {
  let filterByFormula = `{Uppercase Service Name} = '${service_name.toUpperCase()}'`;
  let promos = await getPromos({ filterByFormula });
  return promos;
}

let getCustomPromoByID = async ({ promo_id }) => {
  let promo = await findPromo(promo_id);
  return promo;
}

module.exports = {
  getCustomPromos,
  getCustomPromosByCategory,
  getCustomPromoByID,
}