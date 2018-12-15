let { getPersonByMessengerID, updatePerson } = require('../../../libs/data/people.js');

let uploadProfileImage = async ({ query }, res) => {
  let { messenger_user_id, new_profile_image } = query;

  let person = await getPersonByMessengerID(messenger_user_id);
  let person_image_fields = person.fields.filter(field => field.startsWith('Profile Image URL'));

  let next_image_index = person_image_fields.length + 1;
  let update_data = {
    ['Profile Image URL' + next_image_index]: new_profile_image,
  }

  let redirect_to_blocks = ['Profile Image Uploaded'];

  let updated_person = await updatePerson(update_data, person);
}

module.exports = uploadProfileImage;