let { PRACTICE_DATABASE_BASE_ID, USERS_BASE_ID, SERVICES_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { getTable, getAllDataFromTable, findTableData, createTableData, updateTableData, destroyTableData } = require('../libs/data');

let express = require('express');
let router = express.Router();

// Get Tables
let getUsersTable = getTable('Users');
let getPracticeTable = getTable('Practices');
// let getUsersTable = getTable('Services');

// Tables
let usersTable = getPracticeTable(USERS_BASE_ID);
let usersTable = getPracticeTable(USERS_BASE_ID);

let getUsers = getAllDataFromTable();
let getServices = getAllDataFromTable(SERVICES_BASE_ID);
let getPractices = getAllDataFromTable(PRACTICE_DATABASE_BASE_ID);

let searchProviders = async (data) => {
	let { search_state, search_city, search_zip_code, search_provider_code } = data;

	let filterByFormula = '';
	if (search_state) {
		filterByFormula = `{Practice State} = '${search_state..trim().toLowerCase()}'`;
	} else if (search_city) {
		filterByFormula = `{Practice City} = '${search_city.trim().toLowerCase()}'`;
	} else if (search_zip_code) {
		filterByFormula = `{Practice Zip Code} = '${search_zip_code.trim().toLowerCase()}'`;
	} else if (search_provider_code) {
		filterByFormula = `{Practice Code} = '${search_provider_code.trim().toLowerCase()}'`;
	}

	let providers = await getPractices({ filterByFormula });
	return providers;
}

let toGalleryElement = ({ id: provider_id, fields: provider }) => {
  let title = provider['Practice Name'].slice(0, 80);
  let subtitle = `${provider['Main Provider']} | ${provider['Practice Address']}`;
  console.log('Provider Image', provider['Main Provider Image']);
  let image_url = provider['Main Provider Image'];

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

let getProviders = ({ query }, res) => {
	let first_name = query['first name'];
	let providers = searchProviders(query);
	let textMsg = `Here's what I found ${first_name}`;

	let providerGallery = createGallery(providers.map(toGalleryElement));

	let messages = [{ text: textMsg }, providerGallery];
	res.send({ messages });
}

module.exports = getProviders;