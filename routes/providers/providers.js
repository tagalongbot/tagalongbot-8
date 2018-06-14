let { BASEURL, USERS_BASE_ID } = process.env;
let { createGallery } = require('../../libs/bots.js');
let { createURL, shuffleArray } = require('../../libs/helpers.js');

let { searchProviders, filterProvidersByService, sortProviders, toGalleryElement, createLastGalleryElement } = require('../../libs/providers.js');
let { getUserByMessengerID } = require('../../libs/users.js');
let { createOrUpdateUser } = require('../../libs/providers/providers.js');

let getProviders = async ({ query, params }, res) => {
  let { search_type } = params;
  let { messenger_user_id, first_name, last_name, gender, service_name } = query;
  let { search_providers_state, search_providers_city, search_providers_zip_code, search_provider_code } = query;

	let user = await getUserByMessengerID(messenger_user_id);
	let new_updated_user = await createOrUpdateUser(user, query);

	let providers = await searchProviders(
    { search_type }, 
    { search_providers_state, search_providers_city, search_providers_zip_code, search_provider_code }
  );

  if (!providers[0]) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  if (service_name) providers = filterProvidersByService(service_name, providers);

  let randomProviders = shuffleArray(providers).slice(0, 9).sort(sortProviders).map(
    toGalleryElement({ first_name, last_name, gender, messenger_user_id })
  );

  let last_gallery_element = createLastGalleryElement();

	let providersGallery = createGallery([...randomProviders, last_gallery_element]);
  let textMsg = { text: `Here's are some providers I found ${first_name}` };
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