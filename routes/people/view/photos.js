let { getPersonByMessengerID } = require('../../../libs/data/people.js');
let { createBtn, createQuickReplyMessage, createGallery } = require('../../../libs/bots.js');

let createImageGalleryElement = (image_url, index) => {
  let title = `Image ${index+1}`;

  let remove_btn = createBtn(
    'REMOVE|show_block|[JSON] Remove Image',
    { image_num: index+1 }
  );

  let buttons = [remove_btn];

  return { title, image_url, buttons }
}

let viewProfileImages = async ({ query }, res) => {
  let { messenger_user_id } = query;
  console.log('query', query);

  let person = await getPersonByMessengerID(messenger_user_id);

  if (!person) {
    let redirect_to_blocks = ['Profile Not Created'];
    res.send({ redirect_to_blocks });
    return;
  }

  let person_image_fields = Object.keys(person.fields).filter(field => person.fields[field].startsWith('Profile Image URL'));
  console.log('person_image_fields', person_image_fields);

  let gallery_data = person_image_fields.map(createImageGalleryElement);

  let gallery = createGallery(gallery_data, 'square');

  let txt_msg = `Here are your profile images:`;

  let txt_quick_replies = createQuickReplyMessage(
    `Would you like to add a new image?`,
    createBtn('Yes|show_block|Upload Profile Image'),
    createBtn('No|show_block|Help'),
  );

  let messages = [txt_msg, gallery];

  if (person_image_fields.length < 6) {
    messages.push(txt_quick_replies);
  }

  res.send({ messages });
}

module.exports = viewProfileImages;