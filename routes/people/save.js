let { getPersonByMessengerID, createPerson } = require('../../libs/data/people.js');

let savePerson = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let new_person_data = {
    ['messenger user id']: messenger_user_id,
  }

  let new_person = await createPerson(new_person_data);

  res.sendStatus(200);
}

module.exports = savePerson;