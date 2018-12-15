let { getPersonByMessengerID, createPerson } = require('../../libs/data/people.js');

let savePerson = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let person = await getPersonByMessengerID(messenger_user_id);

  if (person) {
    res.sendStatus(200);
    return;
  }

  let new_person_data = {
    ['messenger user id']: messenger_user_id,
  }

  let new_person = await createPerson(new_person_data);

  res.sendStatus(200);
}

module.exports = savePerson;