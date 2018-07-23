let { BASEURL, USERS_BASE_ID } = process.env;

let { createGallery } = require('../../libs/bots.js');
let { createURL, shuffleArray } = require('../../libs/helpers.js');

let { getUserByMessengerID } = require('../../libs/data/users.js');
let { searchPractices, sortPractices } = require('../../libs/data/practices.js');
let { createOrUpdateUser, toGalleryElement, createLastGalleryElement } = require('../../libs/practices/practices.js');

let getPractices = async ({ query, params }, res) => {
  let { messenger_user_id, first_name, last_name, gender } = query;
  let { zip_code } = params;

	let user = await getUserByMessengerID(messenger_user_id);
	let new_updated_user = await createOrUpdateUser(user, query);

  let practices = await searchPractices(
    { zip_code }
  );
  
  if (!practices[0]) {
    let redirect_to_blocks = ['No Practices Found'];
    res.send({ redirect_to_blocks });
    return;
  }

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