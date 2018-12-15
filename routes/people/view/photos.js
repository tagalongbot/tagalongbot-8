let { getPersonByMessengerID } = require('../../../libs/data/people.js');
let { createBtn, createGallery } = require('../../../libs/bots.js');

let createImageGalleryElement = (image_url) => {

}

let viewProfileImages = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let person = await getPersonByMessengerID(messenger_user_id);
  let person_image_fields = person.fields.filter(field => field.startsWith('Profile Image URL'));
  
  let gallery_data = person_image_fields.map(createImageGalleryElement);
  
  let gallery = createGallery(gallery_data);
}

module.exports = viewProfileImages;