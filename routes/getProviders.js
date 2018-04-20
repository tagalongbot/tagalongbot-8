let { BASEURL, PRACTICE_DATABASE_BASE_ID, USERS_BASE_ID, SERVICES_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
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
let searchProviders = async (data, search_type) => {
	let { search_state, search_city, search_zip_code, search_provider_code } = data;

	let filterByFormula = '';
	if (search_type === 'state') {
		filterByFormula = `{Practice State} = '${search_state.trim().toLowerCase()}'`;
	} else if (search_type === 'city') {
		filterByFormula = `{Practice City} = '${search_city.trim().toLowerCase()}'`;
	} else if (search_type === 'zip_code') {
		filterByFormula = `{Practice Zip Code} = '${search_zip_code.trim().toLowerCase()}'`;
	} else if (search_type === 'code') {
		filterByFormula = `{Practice Code} = '${search_provider_code.trim().toLowerCase()}'`;
	}

	let providers = await getPractices({ filterByFormula });
  console.log(providers);
	return providers;
}

let searchUser = async ({ messenger_user_id }) => {
	let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
	let [user] = await getUsers({ filterByFormula });
	return user;
}

// Create and Update User
let createOrUpdateUser = async (user, query) => {
  let first_name = query['first name'];
	let last_name = query['last name'];
	let gender = query['gender'];
	let messenger_user_id = query['messenger user id'];

  let { search_state, search_city, search_zip_code, search_provider_code } = query;

  if (!user) {
		let newUserData = {
			'messenger user id': messenger_user_id,
			'User Type': 'CONSUMER',
			'First Name': first_name,
			'Last Name': last_name,
			'Gender': gender,
			'Last State Searched': search_state ? search_state.trim().toLowerCase() : null,
			'Last City Searched': search_city ? search_city.trim().toLowerCase() : null,
			'Last Zip Code Searched': search_zip_code ? Number(search_zip_code.trim()) : null,
		}

		let newUser = await createNewUser(newUserData);
	}
  
  let updateUserData = {
    'Last State Searched': search_state ? search_state.trim().toLowerCase() : null,
    'Last City Searched': search_city ? search_city.trim().toLowerCase() : null,
    'Last Zip Code Searched': search_zip_code ? Number(search_zip_code.trim()) : null,
  }

  let updatedUser = await updateUser(updateUserData, user);
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

let getProviders = async ({ query, params }, res) => {
  let { search_type } = params;

	let providers = await searchProviders(query);
	let user = await searchUser({ messenger_user_id });

	let createdOrUpdatedUser = await createOrUpdateUser(user, query);

	let textMsg = { text: `Here's what I found ${first_name}` };
	let providerGallery = createGallery(providers.map(toGalleryElement));

	let messages = [textMsg, providerGallery];
	res.send({ messages });
}

let handleErrors = (req, res) => (error) => {
	let source = 'airtable';
	res.send({ source, error });
}

module.exports = (req, res) => {
	getProviders(req, res)

	.catch(
		handleErrors(req, res)
	);
}