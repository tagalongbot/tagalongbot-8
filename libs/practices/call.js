let { BASEURL } = process.env;

let { getNumbersOnly } = require('../../libs/helpers.js');
let { createButtonMessage } = require('../../libs/bots.js');

let { createCall } = require('../../libs/twilio.js');
let { updatePracticeLead } = require('../../libs/data/practice/leads.js');

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
    // recording_url,
    // recording_status
  }

  let customer_call = await createCall(call_data);
  return customer_call;
}

let updateLeadRecord = async (data) => {
  let { practice, user, promo } = data;
}

module.exports = {
  createCustomerMsg,
  createCustomerCall,
  updateLeadRecord,
}