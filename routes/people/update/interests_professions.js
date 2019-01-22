let { getPersonByMessengerID, updatePerson } = require('../../../libs/data/people.js');

let updateInterestsProfessions = async ({ body }, res) => {
  let { messenger_user_id, data } = body;

  let [interests, professions]  = data;

  let person = await getPersonByMessengerID(messenger_user_id);

  let update_data = {
    ['Interests']: interests.map(interest => interest.label),
    ['Professions']: professions.map(profession => profession.label),
  }

  let updated_person = await updatePerson(update_data, person);

  res.send({ msg: 'ok' });
}

module.exports = updateInterestsProfessions;