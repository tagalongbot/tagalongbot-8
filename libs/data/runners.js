let { RUNNERS_BASE_ID } = process.env;

let { getTable, getAllDataFromTable, findTableData, updateTableData, createTableData } = require('../../libs/data.js');

let getDataTable = getTable('Runners');
let dataTable = getDataTable(RUNNERS_BASE_ID);
let getData = getAllDataFromTable(dataTable);
let createData = createTableData(dataTable);
let findData = findTableData(dataTable);
let updateDataFromTable = updateTableData(dataTable);

let getAllRunners = async ({ filterByFormula = '', view = 'Main View' }) => {
  let runners = await getData({ filterByFormula, view });
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

let createRunner = async (new_runner_data) => {
  let new_runner = await createData(new_runner_data);
  return new_runner;
}

let updateRunner = async (update_data, runner) => {
  let updated_runner = updateDataFromTable(update_data, runner);
  return updated_runner;
}

let getRunnersByZipCode = async ({ zip_code }) => {
  let filterByFormula = `{Zip Code} = '${zip_code}'`;
  let runners = await getAllRunners({ filterByFormula });
  return runners;
}

module.exports = {
  getAllRunners,
  getRunnerByMessengerID,
  getRunnerByID,
  createRunner,
  updateRunner,
  getRunnersByZipCode,
}