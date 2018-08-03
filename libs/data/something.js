let { DATABASE_BASE_ID } = process.env;

let { getTable, getAllDataFromTable, findTableData, updateTableData } = require('../../libs/data.js');

let getDataTable = getTable('DATA TABLE');
let dataTable = getDataTable(DATABASE_BASE_ID);
let getData = getAllDataFromTable(dataTable);
let findData = findTableData(dataTable);
let updateDataFromTable = updateTableData(dataTable);

let getAllData = async (filterQuery = {}) => {
  let practices = await getData(filterQuery);
  return practices;
}

let getDataByUserID = async (messenger_user_id) => {
  let filterByFormula = `{Main Provider Messenger ID} = '${messenger_user_id}'`;
  let [user] = await getData({ filterByFormula,  });
  return user;
}

let getDataByID = async (practice_id) => {
  let practice = await findData(practice_id);
  return practice;
}

let updateData = async (updateData, practice) => {
  let updatedPractice = updateDataFromTable(updateData, practice);
  return updatedPractice;
}
module.exports = {
  getAllData,
  getDataByUserID,
  getDataByID,
  updateData,
}