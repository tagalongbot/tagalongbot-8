let { getPersonByMessengerID } = require('../../../libs/data/people.js');
let { createBtn, createQuickReplyMessage, createGallery } = require('../../../libs/bots.js');

let createImageGalleryElement = (image_url, index) => {
  let title = '';

  let remove_btn = createBtn(
    'REMOVE',
    {  }
  );

  let buttons = [];
}

let viewProfileImages = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let person = await getPersonByMessengerID(messenger_user_id);
  let person_image_fields = person.fields.filter(field => field.startsWith('Profile Image URL'));

  let gallery_data = person_image_fields.map(createImageGalleryElement);

  let gallery = createGallery(gallery_data);

  let txt_msg = `Here are your profile images:`;

  let txt_quick_replies = createQuickReplyMessage(
    `Would you like to add a new image?`
  );

  let messages = [txt_msg, gallery];

  if (person_image_fields.length < 6) {
    messages.push(txt_quick_replies);
  }

  res.send({ messages });
}

module.exports = viewProfileImages;