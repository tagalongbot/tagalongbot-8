// This library is used for Custom Promos inside Services base
let { SERVICES_BASE_ID } = process.env;
let { getTable, getAllDataFromTable, findTableData } = require('../../libs/data.js');

let getCategoryTable = getTable('Custom Categories');
let categoriesTable = getCategoryTable(SERVICES_BASE_ID);
let getCategories = getAllDataFromTable(categoriesTable);
let findCategory = findTableData(categoriesTable);

let getCustomImagesTable = getTable('Custom Images');
let customImagesTable = getCustomImagesTable(SERVICES_BASE_ID);
let getImages = getAllDataFromTable(customImagesTable);
let findImage = findTableData(customImagesTable);

let getCustomCategories = async () => {
  let categories = await getCategories();
  return categories;
}

let getCustomCategoryByID = async ({ category_id }) => {
  let category = await findCategory(category_id);
  return category;
}

let getCutomImages = async () => {
  let images = await getImages();
  return images;
}

let getCustomImagesByCategory = async ({ category_name }) => {
  let filterByFormula = `{Uppercase Category Name} = '${category_name.toUpperCase()}'`;
  let images = await getImages({ filterByFormula });
  return images;
}

let getCustomPromoByID = async ({ promo_id }) => {
  let image = await findImage(promo_id);
  return image;
}

module.exports = {
  getCustomCategories,
  getCustomCategoryByID,
  getCutomImages,
  getCustomImagesByCategory,
  getCustomPromoByID,
}