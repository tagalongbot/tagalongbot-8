let { getPersonByMessengerID, updatePerson } = require('../../../libs/data/people.js');

let updateInterestsProfessions = async ({ body }, res) => {
  let { messenger_user_id, data } = body;
  console.log('body');

  let { interests, professions }  = body;

  let person = await getPersonByMessengerID(messenger_user_id);

  let update_data = {
    ['Interests']: interests,
    ['Professions']: professions,
  }

  let updated_person = await updatePerson(update_data, person);

  res.send({ msg: 'ok' });
}

module.exports = updateInterestsProfessions;