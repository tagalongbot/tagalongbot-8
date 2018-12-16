let { getPersonByMessengerID, destroyPerson } = require('../../libs/data/people.js');

let deleteProfile = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let person = await getPersonByMessengerID(messenger_user_id);

  let destroyed_person = await destroyPerson(person.id);

  let redirect_to_blocks = ['Profile Deleted'];
  res.sendStatus({ redirect_to_blocks });
}

module.exports = deleteProfile;