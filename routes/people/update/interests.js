let { getPersonByMessengerID, updatePerson } = require('../../../libs/data/people.js');

let updateInterests = async ({ body }, res) => {
  let { messenger_user_id, interests } = body;

  let person = await getPersonByMessengerID(messenger_user_id);

  let update_data = {
    ['Interests']: interests,
  }

  let redirect_to_blocks = ['[PREFERENCES] Updated Interests'];

  let updated_person = await updatePerson(update_data, person);
}

module.exports = updateInterests;