// This library is used for Custom Promos inside Services base
let { SERVICES_BASE_ID } = process.env;
let { getTable, getAllDataFromTable, findTableData } = require('../../libs/data.js');

let getCategoryTable = getTable('Custom Promo Categories');
let categoriesTable = getCategoryTable(SERVICES_BASE_ID);
let getCategories = getAllDataFromTable(categoriesTable);
let findCategory = findTableData(categoriesTable);

let getCustomPromoImagesTable = getTable('Custom Promo Images');
let promoImagsTable = getCustomPromoImagesTable(SERVICES_BASE_ID);
let getPromoImages = getAllDataFromTable(promoImagsTable);
let findPromoImage = findTableData(promoImagsTable);

let getCustomPromoCategories = async () => {
  let categories = await getCategories();
  return categories;
}

let getCustomPromoCategoryByID = async ({ category_id }) => {
  let category = await findCategory(category_id);
  return category;
}

let getCutomPromoImages = async () => {
  let promos = await getPromoImages();
  return promos;
}

let getCustomPromoImagesByCategory = async ({ category_name }) => {
  let filterByFormula = `{Uppercase Category Name} = '${category_name.toUpperCase()}'`;
  let promo_images = await getPromoImages({ filterByFormula });
  return promo_images;
}

let getCustomPromoByID = async ({ promo_id }) => {
  let promo = await findPromoImage(promo_id);
  return promo;
}

module.exports = {
  getCustomPromoCategories,
  getCustomPromoCategoryByID,
  getCutomPromoImages,
  getCustomPromoImagesByCategory,
  getCustomPromoByID,
}