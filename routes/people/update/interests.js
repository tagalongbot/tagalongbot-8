let { getPersonByMessengerID, updatePerson } = require('../../../libs/data/people.js');

let updateInterests = async ({ body }, res) => {
  let { messenger_user_id, data } = body;

  let person = await getPersonByMessengerID(messenger_user_id);

  let update_data = {
    ['Interests']: data,
  }

  let updated_person = await updatePerson(update_data, person);

  res.send({ msg: 'ok' });
}

module.exports = updateInterests;