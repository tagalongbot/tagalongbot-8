let { RUNNERS_BASE_ID } = process.env;

let { getTable, getAllDataFromTable, findTableData, updateTableData } = require('../../libs/data.js');

let getDataTable = getTable('Runners');
let dataTable = getDataTable(RUNNERS_BASE_ID);
let getData = getAllDataFromTable(dataTable);
let findData = findTableData(dataTable);
let updateDataFromTable = updateTableData(dataTable);

let getAllRunners = async (filterQuery = {}) => {
  let runners = await getData(filterQuery);
  return runners;
}

let getRunnerByMessengerID = async (messenger_user_id) => {
  let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
  let [runner] = await getData({ filterByFormula,  });
  return runner;
}

let getRunnerByID = async (runner_id) => {
  let runner = await findData(runner_id);
  return runner;
}

let updateData = async (update_data, runner) => {
  let updated_runner = updateDataFromTable(update_data, runner);
  return updated_runner;
}

module.exports = {
  getAllRunners,
  getRunnerByMessengerID,
  getRunnerByID,
  updateData,
}