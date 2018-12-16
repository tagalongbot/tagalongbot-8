let { getPersonByMessengerID, updatePerson } = require('../../../libs/data/people.js');

let updateProfessions = async ({ body }, res) => {
  let { messenger_user_id, data } = body;

  let person = await getPersonByMessengerID(messenger_user_id);

  let update_data = {
    ['Professions']: data,
  }

  let updated_person = await updatePerson(update_data, person);

  if (!updated_person) {
    res.send({ msg: 'NOT UPDATED' });
  }

  res.send({ msg: 'UPDATED' });
}

module.exports = updateProfessions;