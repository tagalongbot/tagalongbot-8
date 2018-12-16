let { getPersonByMessengerID, destroyPerson } = require('../../libs/data/people.js');

let deleteProfile = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let person = await getPersonByMessengerID(messenger_user_id);

  if (!person) {
    let redirect_to_blocks = ['Profile Not Created'];
    res.send({ redirect_to_blocks });
    return;
  }

  let destroyed_person = await destroyPerson(person.id);

  let redirect_to_blocks = ['Profile Deleted'];
  res.send({ redirect_to_blocks });
}

module.exports = deleteProfile;