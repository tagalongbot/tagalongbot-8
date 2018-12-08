let { getPersonByMessengerID, getPersonByPhoneNumber, updatePerson } = require('../../../libs/data/people.js');

let updateSettings = async ({ query }, res) => {
  let { messenger_user_id, is_profile_hidden, age_preference } = query;

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

module.exports = updateSettings;