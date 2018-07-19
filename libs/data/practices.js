let { PRACTICE_DATABASE_BASE_ID, SEARCH_ZIP_CODE_RADIUS } = process.env;

let zipcodes = require('zipcodes');

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

let getPracticesByZipCode = async ({ zip_code, active }) => {
  let filterByFormula = `{Practice Zip Code} = '${zip_code.trim().toUpperCase()}'`;

  if (active) filterByFormula = `AND(${filterByFormula}, {Active?})`;
	let practices = await getPractices({ filterByFormula });

	return practices;
}

let searchPractices = async ({ zip_code }) => {
  let practices = null;

  do {
    zip_code = zipcodes.radius(
      zip_code,
      Number(SEARCH_ZIP_CODE_RADIUS)
    );
    practices = await getPracticesByZipCode({ zip_code, active: true });
  } while(!practices[0]);  

  return practices;
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
  getPracticesByZipCode,
  searchPractices,
  filterPracticesByService,
  sortPractices,
}