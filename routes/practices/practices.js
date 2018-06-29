let { BASEURL, USERS_BASE_ID } = process.env;
let { createGallery } = require('../../libs/bots.js');
let { createURL, shuffleArray } = require('../../libs/helpers.js');

let { filterPracticesByService, sortPractices } = require('../../libs/data/practices.js');
let { getUserByMessengerID } = require('../../libs/data/users.js');
let { searchPractices, createOrUpdateUser, toGalleryElement, createLastGalleryElement } = require('../../libs/practices/practices.js');

let getPractices = async ({ query, params }, res) => {
  let { search_type } = params;

  let { messenger_user_id, first_name, last_name, gender, service_name } = query;
  let { search_practices_state: state_name, search_practices_city: city_name, search_practice_code } = query;

	let user = await getUserByMessengerID(messenger_user_id);
	let new_updated_user = await createOrUpdateUser(user, query);

  let practices = await searchPractices({ state_name, city_name });

  if (!practices[0]) {
    let redirect_to_blocks = ['No Practices Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  if (service_name) practices = filterPracticesByService(service_name, practices);

  let randomPractices = shuffleArray(practices).slice(0, 9).sort(sortPractices).map(
    toGalleryElement({ first_name, last_name, gender, messenger_user_id })
  );

  let last_gallery_element = createLastGalleryElement();

	let practices_gallery = createGallery([...randomPractices, last_gallery_element], 'square');
  let textMsg = { text: `Here's are some providers I found ${first_name}` };
	let messages = [textMsg, practices_gallery];
	res.send({ messages });
}

module.exports = getPractices;