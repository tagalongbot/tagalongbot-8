let { getNumbersOnly } = require('../../libs/helpers.js');
let { createButtonMessage } = require('../../libs/bots.js');

let { createPracticeCall } = require('../../libs/practice/calls.js');

let createCustomerMsg = ({ user_name, practice_name }) => {
  let msg = createButtonMessage(
    `Hey ${user_name} you'll receive a call right now connecting you to ${practice_name} practice`,
    `Main Menu|show_block|Discover Main Menu`,
  );

  return msg;
}

let createCustomerCall = async ({ id: user_id, fields: user }) => {
  let customer_phone_number = getNumbersOnly(user['Phone Number']);

  
  
  let customer_call = await createCall(
    {}
  );
}

let createCallRecord = async (data) => {
  let { practice, user, user_messenger_id } = data;

  let practice_name = practice.fields['Practice Name'];
  let practice_state = practice.fields['Practice State'];
  let practice_city = practice.fields['Practice City'];
  let practice_zip_code = practice.fields['Practice Zip Code'];
  let practice_calls_base_id = practice.fields['Practice Calls Base ID'];
  let practice_phone_number = getNumbersOnly(practice.fields['Practice Phone Number']);

  let user_first_name = user.fields['First Name'];
  let user_last_name = user.fields['Last Name'];
  let user_gender = user.fields['Gender'];
  let user_phone_number = user.fields['Phone Number'];
  
  let call_data = {
    ['messenger user id']: user_messenger_id,
    ['First Name']: user_first_name,
    ['Last Name']: user_last_name,
    ['Gender']: user_gender,
    ['State']: practice_state,
    ['City']: practice_city,
    ['Zip Code']: practice_zip_code,
    ['Phone Number']: user_phone_number,
  };

  let new_call_record = await createPracticeCall(
    { practice_calls_base_id, call_data }
  );

  return new_call_record
}