let { BASEURL } = process.env;

let { getNumbersOnly } = require('../../libs/helpers.js');
let { createButtonMessage } = require('../../libs/bots.js');

let { createCall } = require('../../libs/twilio.js');
let { createPracticeCall } = require('../../libs/data/practice/calls.js');

let createCustomerMsg = ({ user_name, practice_name }) => {
  let msg = createButtonMessage(
    `Hey ${user_name} you'll receive a call right now connecting you to ${practice_name} practice`,
    `Main Menu|show_block|Discover Main Menu`,
  );

  return msg;
}

let createCustomerCall = async (data) => {
  let { practice, user, new_call_record_id, promo_id } = data;

  let practice_id = practice.id;

  let user_id = user.id;  
  let user_phone_number = getNumbersOnly(user.fields['Phone Number']);

  let call_data = {
    phone_number: `+1${user_phone_number}`,
    call_url: `${BASEURL}/practices/call/answered/customer/${user_id}/${practice_id}/${promo_id}`,
    call_status_url: `${BASEURL}/pracices/call/ringing/customer/${user_id}/${practice_id}/${promo_id}`,
    call_status_event: 'ringing',
    // recording_url,
    // recording_status
  }

  let customer_call = await createCall(call_data);
  return customer_call;
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

module.exports = {
  createCustomerMsg,
  createCustomerCall,
  createCallRecord,
}