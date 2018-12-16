let { getPersonByMessengerID, updatePerson } = require('../../../libs/data/people.js');

let updatePreferences = async ({ query }, res) => {
  let { messenger_user_id, gender_preference, age_preference, city } = query;

  let person = await getPersonByMessengerID(messenger_user_id);

  if (!person) {
    let redirect_to_blocks = ['Profile Not Created'];
    res.send({ redirect_to_blocks });
    return;
  }

  let update_data = {}

  if (gender_preference) {
    update_data['Gender Preference'] = gender_preference.toLowerCase();
  }

  if (age_preference) {
    update_data['Age Preference'] = age_preference;
  }

  if (city) {
    update_data['City'] = city;
  }

  let updated_person = await updatePerson(update_data, person);

  let redirect_to_blocks = ['[PREFERENCES] Complete'];
  res.send({ redirect_to_blocks });
}

module.exports = updatePreferences;