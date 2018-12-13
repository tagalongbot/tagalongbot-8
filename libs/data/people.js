let { PEOPLE_BASE_ID } = process.env;

let turf = require('turf');
let turf_circle = require('@turf/circle').default;
let turf_boolean_within = require('@turf/boolean-within').default;
let zipcodes = require('zipcodes');

let { getTable, getAllDataFromTable, createTableData, findTableData, updateTableData, destroyTableData } = require('../../libs/data.js');

let getDataTable = getTable('People');
let data_table = getDataTable(PEOPLE_BASE_ID);
let getData = getAllDataFromTable(data_table);
let createData = createTableData(data_table);
let findData = findTableData(data_table);
let updateDataFromTable = updateTableData(data_table);
let destroyData = destroyTableData(data_table);

let getPeople = async ({ filterByFormula = '', view = 'Main View' } = {}) => {
  let people = await getData({ filterByFormula, view });
  return people;
}

let getPersonByMessengerID = async (messenger_user_id) => {
  let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
  let [person] = await getData({ filterByFormula });
  return person;
}

let getPersonByID = async (person_id) => {
  let runner = await findData(person_id);
  return runner;
}

let getPersonByPhoneNumber = async (phone_number) => {
  let filterByFormula = `{Phone Number} = '${phone_number}'`;
  let [person] = await getData({ filterByFormula });
  return person;
}

let createPerson = async (new_person_data) => {
  let new_person = await createData(new_person_data);
  return new_person;
}

let updatePerson = async (update_data, person) => {
  let updated_person = updateDataFromTable(update_data, person);
  return updated_person;
}

let destroyPerson = async (person_id) => {
  let destroyed_person = destroyData(person_id);
  return destroyed_person;
}

let searchNearbyPeopleByCoordinates = async ({ latitude, longitude }) => {
  let filterByFormula = `{Active?}`;
  let all_people = await getPeople({ filterByFormula });

  let center = [Number(latitude), Number(longitude)];
  let radius = 10;
  let options = { units: 'miles' };
  let circle = turf_circle(center, radius, options);

  let people = all_people.filter(person => {
    let person_latitude = person.fields['Latitude'];
    let person_longitude = person.fields['Longitude'];

    let person_location_point = turf.point([person_latitude, person_longitude]);

    let is_within_circle = turf_boolean_within(person_location_point, circle);
    return is_within_circle;
  });

  return people;
}

let searchNearbyPeopleByZipCode = async ({ zip_code }) => {
  let findPeopleByZipCode = person =>
    person.fields['Zip Code'] === zip_code.trim();

  let filterByFormula = `{Active?}`;
  let all_people = await getPeople({ filterByFormula });

  let people = [];
  let zip_codes_index = 0;
  let used_zip_codes = [];

  let nearby_zip_codes = zipcodes.radius(
    zip_code,
    Number(10)
  );

  do {
    people = all_people.filter(findPeopleByZipCode);

    used_zip_codes.push(zip_code);

    if (!people[0]) {
      zip_code = nearby_zip_codes[zip_codes_index];
      if (!zip_code) break;
      zip_codes_index = zip_codes_index + 1;
    }
  } while(!people[0]);

  while (people.length < 3) {
    if (zip_codes_index === 0) zip_codes_index = zip_codes_index + 1;

    zip_code = nearby_zip_codes[zip_codes_index];
    used_zip_codes.push(zip_code);

    if (!zip_code || used_zip_codes.includes(zip_code)) break;

    let more_people = all_people.filter(findPeopleByZipCode);
    zip_codes_index = zip_codes_index + 1;

    people = [...people, ...more_people];
  }

  return people;
}

let searchNearbyPeopleByCity = async ({ city }) => {
  let filterByFormula = `{City} = '${city}'`;
  let people = await getPeople({ filterByFormula });
  return people;
}

module.exports = {
  getPeople,
  getPersonByMessengerID,
  getPersonByID,
  getPersonByPhoneNumber,
  createPerson,
  updatePerson,
  destroyPerson,
  searchNearbyPeopleByCoordinates,
  searchNearbyPeopleByZipCode,
  searchNearbyPeopleByCity,
}