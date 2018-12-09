let { getPersonByMessengerID, getPersonByPhoneNumber, updatePerson } = require('../../../libs/data/people.js');

let updatePhoneNumber = async ({ query }, res) => {
  let { messenger_user_id, phone_number } = query;

  let person = await getPersonByMessengerID(messenger_user_id);

  if (!person) {
    let redirect_to_blocks = ['[Verify] Person Not Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let update_data = {
    ['Phone Number']: phone_number,
  }

  let redirect_to_blocks = ['[PREFERENCES] Complete'];

  let updated_person = await updatePerson(update_data, person);
}

module.exports = updatePhoneNumber;