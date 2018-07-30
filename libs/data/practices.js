let { PRACTICE_DATABASE_BASE_ID, SEARCH_ZIP_CODE_RADIUS } = process.env;

let zipcodes = require('zipcodes');

let { getTable, getAllDataFromTable, findTableData, updateTableData } = require('../../libs/data.js');

let getPracticeTable = getTable('Practices');
let practiceTable = getPracticeTable(PRACTICE_DATABASE_BASE_ID);
let getPractices = getAllDataFromTable(practiceTable);
let findPractice = findTableData(practiceTable);
let updatePracticeFromTable = updateTableData(practiceTable);

let getAllPractices = async (filterQuery = {}) => {
  let practices = await getPractices(filterQuery);
  return practices;
}

let getPracticeByUserID = async (messenger_user_id) => {
  let filterByFormula = `{Main Provider Messenger ID} = '${messenger_user_id}'`;
  let [user] = await getPractices({ filterByFormula,  });
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
  let filterByFormula = `{Practice Zip Code} = '${zip_code}'`;

  if (active) filterByFormula = `AND(${filterByFormula}, {Active?})`;
	let practices = await getPractices({ filterByFormula });

	return practices;
}

let searchPractices = async ({ zip_code }) => {
  let practices = [];
  let zip_codes_index = 0;
  let used_zip_codes = [];

  let nearby_zip_codes = zipcodes.radius(
    zip_code,
    Number(SEARCH_ZIP_CODE_RADIUS)
  ).slice(0, 15);

  do {
    practices = await getPracticesByZipCode({ zip_code, active: true });
    used_zip_codes.push(zip_code);

    if (!practices[0]) {
      zip_code = nearby_zip_codes[zip_codes_index];
      if (!zip_code) break;
      zip_codes_index = zip_codes_index + 1;
    }
  } while(!practices[0]);

  while (practices.length < 3) {
    if (zip_codes_index === 0) zip_codes_index = zip_codes_index + 1;

    zip_code = nearby_zip_codes[zip_codes_index];
    used_zip_codes.push(zip_code);

    if (!zip_code || used_zip_codes.includes(zip_code)) break;

    let more_practices = await getPracticesByZipCode({ zip_code, active: true });
    zip_codes_index = zip_codes_index + 1;

    practices = [...practices, ...more_practices];
  }

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