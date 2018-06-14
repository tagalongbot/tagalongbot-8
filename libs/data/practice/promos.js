// This library is used for promos inside a practice base
let { BASEURL } = process.env;
let { createURL } = require('../../../libs/helpers.js');
let { getTable, getAllDataFromTable, findTableData } = require('../../../libs/data.js');

let getPromosTable = getTable('Promos');

let getPracticePromo = async ({ provider_base_id, promo_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let promo = await findPromo(promo_id);
  return promo;
}

let getPracticePromos = async ({ provider_base_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let getPromos = getAllDataFromTable(promosTable);

  let promos = await getPromos();
  return promos;
}

module.exports = {
  getPracticePromo,
  getPracticePromos,
}