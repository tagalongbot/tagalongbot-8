let { createGallery } = require('../../../libs/bots.js');
let { getPersonByMessengerID } = require('../../../libs/data/people.js');
let { getTagByProfileMessengerID } = require('../../../libs/tags.js');
let { toTagsGallery } = require('../../../libs/view/tags.js');

let viewTags = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let person = await getPersonByMessengerID(messenger_user_id);
  let tags = await getTagByProfileMessengerID(messenger_user_id);

  let gallery_data = await Promise.all(tags.map(toTagsGallery));

  let gallery = createGallery(gallery_data);

  let messages = [gallery];
  res.send({ messages });
}

module.exports = viewTags;