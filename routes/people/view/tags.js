let { LOAD_MORE_IMAGE_URL } = process.env;

let { createBtn, createGallery } = require('../../../libs/bots.js');
let { getPersonByMessengerID } = require('../../../libs/data/people.js');
let { getTagByProfileMessengerID } = require('../../../libs/tags.js');
let { toTagsGallery } = require('../../../libs/view/tags.js');

let createLastGalleryElement = ({ index }) => {
  let title = 'More Options';
  let image_url = LOAD_MORE_IMAGE_URL;

  let load_more_btn = createBtn(
    `Load More|show_block|[JSON] View Tags Gallery`,
    { index }
  );

  let buttons = [load_more_btn];

  return { title, image_url, buttons };
}

let viewTags = async ({ query }, res) => {
  let { messenger_user_id } = query;
  let index = Number(query.index) || 0;
  let new_index = index + 8;

  let person = await getPersonByMessengerID(messenger_user_id);
  let tags = await getTagByProfileMessengerID(messenger_user_id);

  if (tags.length === 0) {
    let redirect_to_blocks = ['No Tags'];
    res.send({ redirect_to_blocks });
    return;
  }

  let today = new Date();

  let tags_today = tags.filter(tag => {
    let tag_date = new Date(tag.fields['Tag Date / Time']);
    return today.getMonth() === tag_date.getMonth() &&
      today.getDay() === tag_date.getDay() &&
      today.getDay() === tag_date.getDay();
  });

  let gallery_data = await Promise.all(tags.slice(index, new_index).map(toTagsGallery));
  let last_gallery_element = createLastGalleryElement({ index });
  gallery_data.push(last_gallery_element);

  let gallery = createGallery(gallery_data);

  let txtMsg = `You've been tagged by ${tags_today.length} Today`;
  let messages = [gallery];
  res.send({ messages });
}

module.exports = viewTags;