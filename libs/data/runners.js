let { RUNNERS_BASE_ID } = process.env;

let turf = require('turf');
let turf_circle = require('@turf/circle').default;
console.log('turf_circle',turf_circle);
let zipcodes = require('zipcodes');

let { getTable, getAllDataFromTable, findTableData, updateTableData, createTableData } = require('../../libs/data.js');

let getDataTable = getTable('Runners');
let dataTable = getDataTable(RUNNERS_BASE_ID);
let getData = getAllDataFromTable(dataTable);
let createData = createTableData(dataTable);
let findData = findTableData(dataTable);
let updateDataFromTable = updateTableData(dataTable);

let getAllRunners = async ({ filterByFormula = '', view = 'Main View' } = {}) => {
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
  let filterByFormula = `AND({Active?}, {Zip Code} = '${zip_code}')`;
  let runners = await getAllRunners({ filterByFormula });
  return runners;
}

let searchNearbyRunners = async ({ latitude, longitude }) => {
  let filterByFormula = `{Active?}`;
  let all_runners = await getAllRunners({ filterByFormula });

  let center = [latitude, longitude];
  let radius = 10;
  let options = { steps: 10, units: 'miles' };
  let circle = turf_circle(center, radius, options);

  let runners = all_runners.filter(runner => {
    let runner_latitude = runner.fields['Latitude'];
    let runner_longitude = runner.fields['Longitude'];

    let runner_location_point = turf.point([runner_latitude, runner_longitude]);

    return turf.booleanWithin(runner_location_point, circle);
  });

  return runners;
}

module.exports = {
  getAllRunners,
  getRunnerByMessengerID,
  getRunnerByID,
  createRunner,
  updateRunner,
  getRunnersByZipCode,
  searchNearbyRunners,
}