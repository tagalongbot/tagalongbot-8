let { getPersonByMessengerID, updatePerson } = require('../../../libs/data/people.js');

let updatePreferences = async ({ query }, res) => {
  let { messenger_user_id, gender_preference, age_preference, city } = query;
  console.log('query', query);

  let person = await getPersonByMessengerID(messenger_user_id);

  if (!person) {
    let redirect_to_blocks = ['[Verify] Person Not Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let update_data = {
    ['Gender Preference']: gender_preference.toLowerCase(),
    ['Age Preference']: age_preference,
    ['City']: city,
  }

  let redirect_to_blocks = ['[PREFERENCES] Complete'];

  let updated_person = await updatePerson(update_data, person);
}

module.exports = updatePreferences;