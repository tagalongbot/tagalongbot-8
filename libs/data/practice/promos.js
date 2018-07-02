// This library is used for managing promos for each practice
let { getTable, getAllDataFromTable, findTableData, createTableData, updateTableData } = require('../../../libs/data.js');

let getPromosTable = getTable('Promos');

let getPracticePromo = async ({ practice_promos_base_id, promo_id }) => {
  let promosTable = getPromosTable(practice_promos_base_id);
  let findPromo = findTableData(promosTable);
  let promo = await findPromo(promo_id);
  return promo;
}

let getPracticePromos = async ({ practice_promos_base_id, view = 'Main View' }) => {
  let promosTable = getPromosTable(practice_promos_base_id);
  let getPromos = getAllDataFromTable(promosTable);

  let promos = await getPromos({ view });
  return promos;
}

let createPracticePromo = async ({ practice_promos_base_id, promo_data }) => {
  let promosTable = getPromosTable(practice_promos_base_id);
  let createPromo = createTableData(promosTable);
  
  let new_promo = await createPromo(promo_data);
  return new_promo;
}

let updatePracticePromo = async ({ practice_promos_base_id, promo_data, promo }) => {
  let promosTable = getPromosTable(practice_promos_base_id);
  let updatePromo = updateTableData(promosTable);
  
  let updated_promo = await updatePromo(promo_data, promo);
  return updated_promo;
}

module.exports = {
  getPracticePromo,
  getPracticePromos,
  createPracticePromo,
  updatePracticePromo,
}