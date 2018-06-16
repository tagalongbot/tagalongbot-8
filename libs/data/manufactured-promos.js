// This library is used for manufactured promos inside Services base
let { getTable, getAllDataFromTable, findTableData } = require('../../../libs/data.js');

let getPromosTable = getTable('Manufactured Promos');

let getManufacturedPromos = async ({ service_na }) => {
  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let promo = await findPromo(promo_id);
  return promo;
}

let filterManufacturedPromos = () => {}

let getPracticePromos = async ({ provider_base_id, view = 'Main View' }) => {
  let promosTable = getPromosTable(provider_base_id);
  let getPromos = getAllDataFromTable(promosTable);

  let promos = await getPromos({ view });
  return promos;
}

module.exports = {
  getPracticePromo,
  getPracticePromos,
}