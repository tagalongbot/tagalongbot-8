// This library is used for Custom Promos inside Services base
let { SERVICES_BASE_ID } = process.env;
let { getTable, getAllDataFromTable, findTableData } = require('../../libs/data.js');

let getCategoryTable = getTable('Custom Promo Categories');
let categoriesTable = getCategoryTable(SERVICES_BASE_ID);
let getCategories = getAllDataFromTable(categoriesTable);
let findCategory = findTableData(categoriesTable);

let getPromosTable = getTable('Custom Promos');
let promosTable = getPromosTable(SERVICES_BASE_ID);
let getPromos = getAllDataFromTable(promosTable);
let findPromo = findTableData(promosTable);

let getCustomPromoCategories = async () => {
  let categories = await getCategories();
  return categories;
}

let getCustomPromoCategoryByID = async () => {
  let category
}

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
  getCustomPromoCategories,
  getCustomPromos,
  getCustomPromosByCategory,
  getCustomPromoByID,
}