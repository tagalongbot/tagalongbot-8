let { getPersonByMessengerID, updatePerson } = require('../../../libs/data/people.js');

let updateProfessions = async ({ body }, res) => {
  let { messenger_user_id, data } = body;

  let person = await getPersonByMessengerID(messenger_user_id);

  let update_data = {
    ['Professions']: data,
  }

  let redirect_to_blocks = ['[PREFERENCES] Updated Professions'];

  let updated_person = await updatePerson(update_data, person);

  res.send({ msg: 'ok' });
}

module.exports = updateProfessions;