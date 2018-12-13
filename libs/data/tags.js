let { TAGS_BASE_ID } = process.env;

let zipcodes = require('zipcodes');

let { getTable, getAllDataFromTable, findTableData, updateTableData, createTableData } = require('../../libs/data.js');

let getDataTable = getTable('Tags');
let dataTable = getDataTable(TAGS_BASE_ID);
let getData = getAllDataFromTable(dataTable);
let createData = createTableData(dataTable);
let findData = findTableData(dataTable);
let updateDataFromTable = updateTableData(dataTable);

let getAllTags = async ({ filterByFormula = '', view = 'Main View' } = {}) => {
  let tags = await getData({ filterByFormula, view });
  return tags;
}

let getTagByID = async (tag_id) => {
  let tag = await findData(tag_id);
  return tag;
}

let createTag = async (new_tag_data) => {
  let new_tag = await createData(new_tag_data);
  return new_tag;
}

let updateTag = async (update_data, tag) => {
  let updated_tag = updateDataFromTable(update_data, tag);
  return updated_tag;
}

module.exports = {
  getAllTags,
  getTagByID,
  createTag,
  updateTag,
}