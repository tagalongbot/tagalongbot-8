let { BASEURL, USERS_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { shuffleArray } = require('../libs/helpers');

let { searchProviders } = require('../libs/providers');
let { getTable, getAllDataFromTable, createTableData, updateTableData } = require('../libs/data');

let getUsersTable = getTable('Users');
let usersTable = getUsersTable(USERS_BASE_ID);

let getUsers = getAllDataFromTable(usersTable);
let createNewUser = createTableData(usersTable);
let updateUser = updateTableData(usersTable);

// Helper Methods
let searchUser = async ({ messenger_user_id }) => {
	let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
	let [user] = await getUsers({ filterByFormula });
	return user;
}

let createOrUpdateUser = async (user, query) => {
  let first_name = query['first name'];
	let last_name = query['last name'];
	let gender = query['gender'];
	let messenger_user_id = query['messenger user id'];

  let { search_providers_state, search_providers_city, search_providers_zip_code } = query;

  let last_state_searched = search_providers_state ? search_providers_state.trim().toLowerCase() : null;
  let last_city_searched = search_providers_city ? search_providers_city.trim().toLowerCase() : null;
  let last_zip_code_searched = search_providers_zip_code ? Number(search_providers_zip_code.trim()) : null;

  if (!user) {
		let newUserData = {
			'messenger user id': messenger_user_id,
			'User Type': 'CONSUMER',
			'First Name': first_name,
			'Last Name': last_name,
			'Gender': gender,
			'Last State Searched': last_state_searched,
			'Last City Searched': last_city_searched,
			'Last Zip Code Searched': last_zip_code_searched,
		}

		let newUser = await createNewUser(newUserData);
    return newUser;
	}

  let updateUserData = {};

  if (last_state_searched) {
    updateUserData['Last State Searched'] = last_state_searched;
  }

  if (last_city_searched) {
    updateUserData['Last City Searched'] = last_city_searched;
  }

  if (last_zip_code_searched) {
    updateUserData['Last Zip Code Searched'] = last_zip_code_searched;
  }

  let updatedUser = await updateUser(updateUserData, user);
  return updatedUser;
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
    url: `${BASEURL}/provider/promos?provider_id=${provider_id}&provider_base_id=${provider['Practice Base ID']}&provider_name=${encodeURIComponent(provider['Practice Name'])}`
  }

  let buttons = [btn1, btn2];

  let element = { title, subtitle, image_url, buttons};
  return element;
}

// Main
let getProviders = async ({ query, params }, res) => {
  let { search_type } = params;

  let first_name = query['first name'];
  let last_name = query['last name'];
  let first_name = query['first name'];
	let messenger_user_id = query['messenger user id'];

	let user = await searchUser({ messenger_user_id });
	let createdOrUpdatedUser = await createOrUpdateUser(user, query);

	let providers = await searchProviders(query, search_type);

  if (!providers[0]) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let textMsg = { text: `Here's are some providers I found ${first_name}` };
  let randomProviders = shuffleArray(providers).slice(0, 10).map(toGalleryElement);
	let providersGallery = createGallery(randomProviders);

	let messages = [textMsg, providersGallery];
	res.send({ messages });
}

let handleErrors = (req, res) => (error) => {
  console.log(error);
	let source = 'airtable';
	res.send({ source, error });
}

module.exports = (req, res) => {
	getProviders(req, res)

	.catch(
		handleErrors(req, res)
	);
}