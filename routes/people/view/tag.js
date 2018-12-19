let { LOAD_MORE_IMAGE_URL } = process.env;

let { createBtn, createGallery } = require('../../../libs/bots.js');
let { getTagByID } = require('../../../libs/data/tags.js');
let { toTagsGallery } = require('../../../libs/view/tags.js');

let viewTag = async ({ query }, res) => {
  let { tag_id } = query;

  let tag = await getTagByID(tag_id);
  let tagged_person_name = tag.fields['Profile Name'];

  let gallery_data = await Promise.all([tag].map(toTagsGallery));
  console.log('gallery_data', gallery_data);

  let gallery = createGallery(gallery_data, 'square');
  console.log('gallery', gallery);

  let txtMsg = `Hey you've been matched with ${tagged_person_name}`;
  let messages = [txtMsg, gallery];
  console.log('messages', messages);
  res.send({ messages });
}

module.exports = viewTag;