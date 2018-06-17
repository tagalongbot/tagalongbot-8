// This library is used for promos inside a practice base
let { getTable, getAllDataFromTable, findTableData, createTableData, updateTableData } = require('../../../libs/data.js');

let getPromosTable = getTable('Promos');

let getPracticePromo = async ({ provider_base_id, promo_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let promo = await findPromo(promo_id);
  return promo;
}

let getPracticePromos = async ({ provider_base_id, view = 'Main View' }) => {
  let promosTable = getPromosTable(provider_base_id);
  let getPromos = getAllDataFromTable(promosTable);

  let promos = await getPromos({ view });
  return promos;
}

let createPracticePromo = async ({ provider_base_id, promo_data }) => {
  let promosTable = getPromosTable(provider_base_id);
  let createPromo = createTableData(promosTable);
  
  let new_promo = await createPromo(promo_data);
  return new_promo;
}

let updatePracticePromo = async ({ provider_base_id, promo_data, promo }) => {
  let promosTable = getPromosTable(provider_base_id);
  let updatePromo = updateTableData(promosTable);
  
  let new_promo = await updatePromo(promo_data, promo);
  return new_promo;
}

module.exports = {
  getPracticePromo,
  getPracticePromos,
  createPracticePromo,
  updatePracticePromo,
}