let { BASEURL, USERS_BASE_ID } = process.env;
let { createGallery } = require('../../libs/bots.js');
let { createURL, shuffleArray } = require('../../libs/helpers.js');

let { searchProviders, filterProvidersByService, sortProviders } = require('../../libs/data/practices.js);
let { getUserByMessengerID } = require('../../libs/data/users.js');
let { createOrUpdateUser, toGalleryElement, createLastGalleryElement } = require('../../libs/providers/practices.js);

let getProviders = async ({ query, params }, res) => {
  let { search_type } = params;
  let { messenger_user_id, first_name, last_name, gender, service_name } = query;
  let { search_providers_state, search_providers_city, search_providers_zip_code, search_provider_code } = query;

	let user = await getUserByMessengerID(messenger_user_id);
	let new_updated_user = await createOrUpdateUser(user, query);

	let practices = await searchProviders(
    { search_type }, 
    { search_providers_state, search_providers_city, search_providers_zip_code, search_provider_code }
  );

  if (!practices[0]) {
    let redirect_to_blocks = ['No Providers Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  if (service_name) practices = filterProvidersByService(service_name, practices);

  let randomProviders = shuffleArray(practices).slice(0, 9).sort(sortProviders).map(
    toGalleryElement({ first_name, last_name, gender, messenger_user_id })
  );

  let last_gallery_element = createLastGalleryElement();

	let practices_gallery = createGallery([...randomProviders, last_gallery_element], 'square');
  let textMsg = { text: `Here's are some providers I found ${first_name}` };
	let messages = [textMsg, practices_gallery];
	res.send({ messages });
}

module.exports = getProviders;