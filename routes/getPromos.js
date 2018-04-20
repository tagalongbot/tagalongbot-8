let { BASEURL, PRACTICE_DATABASE_BASE_ID, USERS_BASE_ID, SERVICES_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { shuffleArray } = require('../libs/helpers');
let { getTable, getAllDataFromTable, createTableData, updateTableData } = require('../libs/data');

// Get Tables
let getUsersTable = getTable('Users');
let getPracticeTable = getTable('Practices');
let getServicesTable = getTable('Services');

// Tables
let usersTable = getUsersTable(USERS_BASE_ID);
let practiceTable = getPracticeTable(PRACTICE_DATABASE_BASE_ID);
// let servicesTable = getServicesTable(SERVICES_BASE_ID);

// Get Data
let getUsers = getAllDataFromTable(usersTable);
let getPractices = getAllDataFromTable(practiceTable);
// let getServices = getAllDataFromTable(servicesTable);

// Create Data
let createNewUser = createTableData(usersTable);

// Update Data
let updateUser = updateTableData(usersTable);

// Search Methods
let searchPromotions = async (data, search_type) => {
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

	let providers = await getPractices({ filterByFormula });
	return providers;
}

let toGalleryElement = ({ id: provider_id, fields: provider }) => {
  let title = provider['Practice Name'].slice(0, 80);
  let subtitle = `${provider['Main Provider']} | ${provider['Practice Address']}`;
  let image_url = provider['Main Provider Image'][0].url;

  let btn1 = {
    title: 'View Services',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/services?provider_id=${provider_id}&provider_name=${encodeURIComponent(provider['Practice Name'])}`
  }

  let btn2 = {
    title: 'View Promos',
    type: 'json_plugin_url',
    url: `${BASEURL}/provider/promos?provider_id=${provider_id}&provider_name=${encodeURIComponent(provider['Practice Name'])}`
  }

  let buttons = [btn1, btn2];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

let getPromos = async ({ query, params }, res) => {
  let { search_type } = params;

  let first_name = query['first name'];
	let messenger_user_id = query['messenger user id'];

	let promotions = await searchPromotions(query, search_type);

  if (!promotions[0]) {
    let redirect_to_blocks = ['No Promos Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let textMsg = { text: `Here's are some promotions I found ${first_name}` };
  let randomPromotions = shuffleArray(promotions).slice(0, 10).map(toGalleryElement);
	let promotionsGallery = createGallery(randomPromotions);

	let messages = [textMsg, promotionsGallery];
	res.send({ messages });
}

let handleErrors = (req, res) => (error) => {
  console.log(error);
	let source = 'airtable';
	res.send({ source, error });
}

module.exports = (req, res) => {
	getPromos(req, res)

	.catch(
		handleErrors(req, res)
	);
}