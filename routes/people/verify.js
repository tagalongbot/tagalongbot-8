let { getPersonByPhoneNumber, updatePerson } = require('../../libs/data/people.js');

let { sendBroadcast } = require('../../libs/chatfuel.js');

let verifyPerson = async ({ query }, res) => {
  let { phone_number } = query;

  let person = await getPersonByPhoneNumber(phone_number);

  if (!person) {
    let redirect_to_blocks = ['[Verify] Person Not Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let update_data = {
    ['Verified?']: true
  }

  let updated_person = await updatePerson(update_data, person);

  let redirect_to_blocks = ['[Verify] User Verified'];

  let verified_person_name = `${updated_person.fields['First Name']} ${updated_person.fields['Last Name']}`;

  let set_attributes = { verified_person_name };

  res.send({ set_attributes, redirect_to_blocks });

  // Notify User
  let user_id = '';
  let block_name = '';
  let message_tag = 'ACCOUNT_UPDATE';

  let sent_broadcast = await sendBroadcast(
    { user_id, block_name, message_tag }
  );
}

module.exports = verifyPerson;