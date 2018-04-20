let { BASEURL, PRACTICE_DATABASE_BASE_ID, USERS_BASE_ID, SERVICES_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { shuffleArray } = require('../libs/helpers');
let { getTable, getAllDataFromTable, createTableData, updateTableData } = require('../libs/data');

let getPracticeTable = getTable('Practices');
let practiceTable = getPracticeTable(PRACTICE_DATABASE_BASE_ID);
let getPractices = getAllDataFromTable(practiceTable);

let searchProviders = async (data, search_type) => {
	let { search_providers_state, search_providers_city, search_providers_zip_code, search_provider_code } = data;

	let filterByFormula = '';
	if (search_type === 'state') {
		filterByFormula = `{Practice State} = '${search_providers_state.trim().toLowerCase()}'`;
	} else if (search_type === 'city') {
		filterByFormula = `{Practice City} = '${search_providers_city.trim().toLowerCase()}'`;
	} else if (search_type === 'zip_code') {
		filterByFormula = `{Practice Zip Code} = '${search_providers_zip_code.trim().toLowerCase()}'`;
	} else if (search_type === 'code') {
		filterByFormula = `{Practice Code} = '${search_provider_code.trim().toLowerCase()}'`;
	}

  // Concatenating Search Formula
  filterByFormula = `AND({Active?}, ${filterByFormula})`;
	let providers = await getPractices({ filterByFormula });
	return providers;
}

module.exports = {
  searchProviders,
}