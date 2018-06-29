let { PRACTICE_DATABASE_BASE_ID } = process.env;

let { getTable, getAllDataFromTable, findTableData, updateTableData } = require('../../libs/data.js');

let getPracticeTable = getTable('Practices');
let practiceTable = getPracticeTable(PRACTICE_DATABASE_BASE_ID);
let getPractices = getAllDataFromTable(practiceTable);
let findPractice = findTableData(practiceTable);
let updatePracticeFromTable = updateTableData(practiceTable);

let getAllPractices = async () => {
  let practices = await getPractices();
  return practices;
}

let getPracticeByUserID = async (messenger_user_id, fields = []) => {
  let filterByFormula = `{Claimed By Messenger User ID} = '${messenger_user_id}'`;
  let [user] = await getPractices({ filterByFormula, fields });
  return user;
}

let getPracticeByID = async (practice_id) => {
  let practice = await findPractice(practice_id);
  return practice;
}

let updatePractice = async (updateData, practice) => {
  let updatedPractice = updatePracticeFromTable(updateData, practice);
  return updatedPractice;
}

let getPracticesByState = async ({ state_name, active }) => {
  let filterByFormula = `{All Uppercase Practice State} = '${state_name.trim().toUpperCase()}'`;

  if (active) filterByFormula = `AND(${filterByFormula}, {Active?})`;
	let practices = await getPractices({ filterByFormula });

	return practices;
}

let getPracticesByCity = async ({ city_name, active }) => {
  let filterByFormula = `{All Uppercase Practice City} = '${city_name.trim().toUpperCase()}'`;

  if (active) filterByFormula = `AND(${filterByFormula}, {Active?})`;
	let practices = await getPractices({ filterByFormula });

	return practices;
}

let getPracticesByZipCode = async ({ zip_code, active }) => {
  let filterByFormula = `{Practice Zip Code} = '${zip_code.trim().toUpperCase()}'`;

  if (active) filterByFormula = `AND(${filterByFormula}, {Active?})`;
	let practices = await getPractices({ filterByFormula });

	return practices;
}

let searchPractices = async ({ state_name, city_name, zip_code }) => {
  if (state_name) {
    let practices = await getPracticesByState({ state_name, active: true });
    return practices;
  }

  if (city_name) {
    let practices = await getPracticesByCity({ city_name, active: true });
    return practices;
  }

  if (zip_code) {
    let practices = await getPracticesByZipCode({ zip_code, active: true });
    return practices;
  }
}

let filterPracticesByService = (service_name, practices) => {
  let service_name_lowercased = service_name.trim().toLowerCase();

  let serviceToLowerCase = service => service.toLowerCase();

  let practicesByService = practices.filter(
    (practice) => practice.fields['Practice Services'].map(serviceToLowerCase).includes(service_name_lowercased)
  );

  return practicesByService;
}

let sortPractices = (practice1, practice2) => {
  if (practice1.fields['Active?'] && !practice2.fields['Active?']) return -1;
  if (practice1.fields['Active?'] && practice2.fields['Active?']) return 0;
  if (!practice1.fields['Active?']) return 1;
}

module.exports = {
  getAllPractices,
  getPracticeByUserID,
  getPracticeByID,
  updatePractice,
  getPracticesByState,
  getPracticesByCity,
  getPracticesByZipCode,
  searchPractices,
  filterPracticesByService,
  sortPractices,
}