let { getPersonByMessengerID, updatePerson } = require('../../../../libs/data/people.js');

let deleteProfileImage = async ({ query }, res) => {
  let { messenger_user_id, image_num } = query;

  let person = await getPersonByMessengerID(messenger_user_id);

  let update_data = {
    ['Profile Image URL' + image_num]: null,
  }

  let redirect_to_blocks = ['Profile Image Deleted'];

  let updated_person = await updatePerson(update_data, person);

  res.send({ redirect_to_blocks });
}

module.exports = deleteProfileImage;