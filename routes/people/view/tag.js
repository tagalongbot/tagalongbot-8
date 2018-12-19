let { LOAD_MORE_IMAGE_URL } = process.env;

let { createBtn, createGallery } = require('../../../libs/bots.js');
let { getTagByID } = require('../../../libs/data/tags.js');
let { toTagsGallery } = require('../../../libs/view/tags.js');

let viewTag = async ({ query }, res) => {
  let { tag_id } = query;
  console.log('query', query);

  let tag = await getTagByID(tag_id);
  let tagged_person_name = tag.fields['Profile Name'];

  let gallery_data = await [tag].map(toTagsGallery);

  let gallery = createGallery(gallery_data);

  let txtMsg = `Hey you've been matched with ${tagged_person_name}`;
  let messages = [gallery];
  res.send({ messages });
}

module.exports = viewTag;