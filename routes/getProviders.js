let { BASEURL, USERS_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots');
let { createURL, shuffleArray } = require('../libs/helpers');

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

  if (last_state_searched) updateUserData['Last State Searched'] = last_state_searched;
  if (last_city_searched) updateUserData['Last City Searched'] = last_city_searched;
  if (last_zip_code_searched) updateUserData['Last Zip Code Searched'] = last_zip_code_searched;

  let updatedUser = await updateUser(updateUserData, user);
  return updatedUser;
}

let createButtons = (is_provider_active, is_provider_claimed, data) => {
  if (is_provider_active) {
    let view_services_btn_url = createURL(`${BASEURL}/provider/services`, data);
    let view_promos_btn_url = createURL(`${BASEURL}/provider/promos`, data);

    let btn1 = {
      title: 'View Services',
      type: 'json_plugin_url',
      url: view_services_btn_url,
    }

    let btn2 = {
      title: 'View Promos',
      type: 'json_plugin_url',
      url: view_promos_btn_url,
    }
    
    return [btn1, btn2];
  }

  if (!is_provider_claimed) {
    let claim_practice_url = createURL(`${BASEURL}/provider/claim/email`, data);

    let btn = {
      title: 'Claim Practice',
      type: 'json_plugin_url',
      url: claim_practice_url
    }

    return [btn];
  }

  if (is_provider_claimed && !is_provider_active) {
    let btn = {
      title: 'Already Claimed',
      type: 'show_block',
      block_name: 'Practice Already Claimed'
    }
    
    return [btn];
  }
}

let toGalleryElement = ({ first_name, last_name, gender, messenger_user_id }) => ({ id: provider_id, fields: provider }) => {
  let title = provider['Practice Name'].slice(0, 80);
  let subtitle = `${provider['Main Provider']} | ${provider['Practice Address']}`;
  let image_url = provider['Main Provider Image'][0].url;

  let provider_name = encodeURIComponent(provider['Practice Name']);
  let provider_base_id = provider['Practice Base ID'];
  let data = { provider_id, provider_base_id, provider_name, first_name, last_name, gender, messenger_user_id };

  let buttons = createButtons(provider['Active?'], provider['Claimed?'], data);

  let element = { title, subtitle, image_url, buttons };
  return element;
}

let firstActiveThenUnclaimed = (provider1, provider2) => {
  if (provider1.fields['Active?'] && !provider2.fields['Active?']) return -1;
  if (provider1.fields['Active?'] && provider2.fields['Active?']) return 0;
  if (!provider1.fields['Active?'] && !provider2.fields['Claimed?']) return 1;
}

// Main
let getProviders = async ({ query, params }, res) => {
  let { search_type } = params;

  let first_name = query['first name'];
  let last_name = query['last name'];
  let gender = query['gender'];
	let messenger_user_id = query['messenger user id'];
  let data = { first_name, last_name, gender, messenger_user_id };

	let user = await searchUser({ messenger_user_id });
	let createdOrUpdatedUser = await createOrUpdateUser(user, query);

	let providers = await searchProviders(query, search_type);

  if (!providers[0]) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let textMsg = { text: `Here's are some providers I found ${first_name}` };
  let randomProviders = shuffleArray(providers).slice(0, 10).sort(firstActiveThenUnclaimed).map(toGalleryElement(data));
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