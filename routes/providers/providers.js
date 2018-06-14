let { BASEURL, USERS_BASE_ID } = process.env;
let { createGallery } = require('../libs/bots.js');
let { createURL, shuffleArray } = require('../libs/helpers.js');

let { searchProviders, filterProvidersByService, sortProviders, toGalleryElement, createLastGalleryElement } = require('../libs/providers.js');
let { getUserByMessengerID } = require('../libs/users.js');
let { createOrUpdateUser } = require('../libs/providers/providers.js');

// Main
let getProviders = async ({ query, params }, res) => {
  let { search_type } = params;

  let first_name = query['first name'] || query['first_name'];
  let last_name = query['last name'] || query['last_name'];
  let gender = query['gender'];
	let messenger_user_id = query['messenger user id'] || query['messenger_user_id'];
  let data = { first_name, last_name, gender, messenger_user_id };

  let service_name = query['service_name'];

	let user = await getUserByMessengerID(messenger_user_id);
	let new_updated_user = await createOrUpdateUser(user, query);

	let providers = await searchProviders(query, { search_type });

  if (!providers[0]) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  if (service_name) providers = filterProvidersByService(service_name, providers);

  let textMsg = { text: `Here's are some providers I found ${first_name}` };
  let randomProviders = shuffleArray(providers).slice(0, 9).sort(sortProviders).map(toGalleryElement(data));

  let last_gallery_element = createLastGalleryElement();

	let providersGallery = createGallery([...randomProviders, last_gallery_element]);
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