let { BASE_ID } = process.env;

let zipcodes = require('zipcodes');

let { getTable, getAllDataFromTable, findTableData, updateTableData, createTableData } = require('../../libs/data.js');

let getDataTable = getTable('Matches');
let dataTable = getDataTable(BASE_ID);
let getData = getAllDataFromTable(dataTable);
let createData = createTableData(dataTable);
let findData = findTableData(dataTable);
let updateDataFromTable = updateTableData(dataTable);

let getAllMatches = async ({ filterByFormula = '', view = 'Main View' } = {}) => {
  let matches = await getData({ filterByFormula, view });
  return matches;
}

let getMatchByID = async (match_id) => {
  let match = await findData(match_id);
  return match;
}

let createMatch = async (new_match_data) => {
  let new_match = await createData(new_match_data);
  return new_match;
}

let updateMatch = async (update_data, match) => {
  let updated_match = updateDataFromTable(update_data, match);
  return updated_match;
}

module.exports = {
  getAllMatches,
  getMatchByID,
  createMatch,
  updateMatch,
}