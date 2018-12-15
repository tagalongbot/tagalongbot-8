let { getPersonByMessengerID, getPersonByPhoneNumber, updatePerson } = require('../../../libs/data/people.js');

let updateProfile = async ({ query }, res) => {
  let { messenger_user_id, messenger_link, latitude, longitude, zip_code, city, state, country } = query;

  let person = await getPersonByMessengerID(messenger_user_id);

  if (!person) {
    let redirect_to_blocks = ['[Verify] Person Not Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let update_data = {
    ['Is Profile Hidden']: is_profile_hidden.toUpperCase(),
  }

  let redirect_to_blocks = ['[SETTINGS] Complete'];

  let updated_person = await updatePerson(update_data, person);
}

module.exports = updateProfile;