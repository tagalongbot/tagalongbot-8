let { PRACTICE_DATABASE_BASE_ID, DEFAULT_PROVIDER_IMAGE, SEARCH_PROVIDERS_MORE_OPTIONS_IMAGE_URL } = process.env;
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

let getPracticeByID = async (provider_id) => {
  let practice = await findPractice(provider_id);
  return practice;
}

let updatePractice = async (updateData, provider) => {
  let updatedProvider = updatePracticeFromTable(updateData, provider);
  return updatedProvider;
}

let getPracticeByState = async ({ state_name, active }) => {
  let filterByFormula = `{All Uppercase Practice State} = '${state_name.trim().toUpperCase()}'`;

  if (active) filterByFormula = `AND(${filterByFormula}, {Active?})`;
	let providers = await getPractices({ filterByFormula });

	return providers;
}

let getPracticeByCity = async ({ city_name, active }) => {
  let filterByFormula = `{All Uppercase Practice State} = '${city_name.trim().toUpperCase()}'`;

  if (active) filterByFormula = `AND(${filterByFormula}, {Active?})`;
	let providers = await getPractices({ filterByFormula });

	return providers;
}



let searchProviders = async ({ search_type, active = false }, data) => {
	let { search_providers_state, search_providers_city, search_providers_zip_code, search_provider_code } = data;

	let filterByFormula = '';
	if (search_type.toLowerCase() === 'state') {
		filterByFormula = `{All Uppercase Practice State} = '${search_providers_state.trim().toUpperCase()}'`;
	} else if (search_type.toLowerCase() === 'city') {
		filterByFormula = `{All Uppercase Practice City} = '${search_providers_city.trim().toUpperCase()}'`;
	} else if (search_type.toLowerCase() === 'zip_code') {
		filterByFormula = `{Practice Zip Code} = '${search_providers_zip_code.trim().toUpperCase()}'`;
	} else if (search_type.toLowerCase() === 'code') {
		filterByFormula = `{Practice Code} = '${search_provider_code.trim().toUpperCase()}'`;
	}

  // Concatenating Search Formula
  if (active) filterByFormula = `AND(${filterByFormula}, {Active?})`;
	let providers = await getPractices({ filterByFormula });

	return providers;
}

let filterPracticessByService = (service_name, providers) => {
  let service_name_lowercased = service_name.trim().toLowerCase();

  let serviceToLowerCase = service => service.toLowerCase();

  let providersByService = providers.filter(
    (provider) => provider.fields['Practice Services'].map(serviceToLowerCase).includes(service_name_lowercased)
  );

  return providersByService;
}

let sortPractices = (provider1, provider2) => {
  if (provider1.fields['Active?'] && !provider2.fields['Active?']) return -1;
  if (provider1.fields['Active?'] && provider2.fields['Active?']) return 0;
  if (!provider1.fields['Active?']) return 1;
}

module.exports = {
  getAllPractices,
  getPracticeByUserID,
  getPracticeByID,
  updatePractice,
  searchProviders,
  filterPracticessByService,
  sortPractices,
}