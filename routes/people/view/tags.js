let { createGallery } = require('../../../libs/bots.js');
let { getPersonByMessengerID } = require('../../../libs/data/people.js');
let { getTagByProfileMessengerID } = require('../../../libs/tags.js');
let { toTagsGallery } = require('../../../libs/view/tags.js');

let viewTags = async ({ query }, res) => {
  let { messenger_user_id } = query;
  let index = Number(query['index']) || 0;
  let new_index = index + 8;

  let person = await getPersonByMessengerID(messenger_user_id);
  let tags = await getTagByProfileMessengerID(messenger_user_id);

  if (tags.length === 0) {
    let redirect_to_blocks = ['No Tags'];
    res.send({ redirect_to_blocks });
    return;
  }

  let gallery_data = await Promise.all(tags.map(toTagsGallery));

  let gallery = createGallery(gallery_data);

  let txtMsg = `Here's a list of the people who've tagged you`;
  let messages = [gallery];
  res.send({ messages });
}

module.exports = viewTags;