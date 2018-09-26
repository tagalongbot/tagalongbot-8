let { getPersonByMessengerID, getPersonByPhoneNumber, updatePerson } = require('../../libs/data/people.js');

let { sendBroadcast } = require('../../libs/chatfuel.js');

let verifyPerson = async ({ query }, res) => {
  let { messenger_user_id, phone_number } = query;

  let person_verifying = await getPersonByMessengerID(messenger_user_id);

  let person = await getPersonByPhoneNumber(phone_number);

  if (!person) {
    let redirect_to_blocks = ['[Verify] Person Not Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let update_data = {
    ['Verified?']: true,
    ['Verified By']: `${person_verifying.fields['First Name']} ${person_verifying.fields['Last Name']}`
  }

  let updated_person = await updatePerson(update_data, person);

  let redirect_to_blocks = ['[Verify] User Verified'];

  let verified_person_name = `${updated_person.fields['First Name']} ${updated_person.fields['Last Name']}`;

  let set_attributes = { verified_person_name };

  res.send({ set_attributes, redirect_to_blocks });

  // Notify User
  let user_id = updated_person.fields['messenger user id'];
  let block_name = '[Notification] User Verified';
  let message_tag = 'ACCOUNT_UPDATE';

  let verified_by_friend_name = `${person_verifying.fields['First Name']} ${person_verifying.fields['Last Name']}`;
  let user_attributes = { verified_by_friend_name };

  let sent_broadcast = await sendBroadcast(
    { user_id, block_name, message_tag, user_attributes }
  );
}

module.exports = verifyPerson;