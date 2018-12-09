let { getPersonByMessengerID, destroyPerson } = require('../../libs/data/people.js');

let deleteProfile = async ({ query }, res) => {
  let { messenger_user_id } = query;
  
  let person = await getPersonByMessengerID(messenger_user_id);

  let destroyed_person = await destroyPerson(person.id);

  res.sendStatus(200);
}

module.exports = deleteProfile;