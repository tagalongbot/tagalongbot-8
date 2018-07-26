let { BASEURL } = process.env;

let { getNumbersOnly } = require('../../libs/helpers.js');
let { createCall } = require('../../libs/twilio.js');
let { getUniqueLead, updatePracticeLead } = require('../../libs/data/practice/leads.js');
let { createBtn, createButtonMessage } = require('../../libs/bots.js');

let createCustomerMsg = ({ practice, user, promo }) => {
  let practice_id = practice.id;
  let practice_name = practice.fields['Practice Name'];

  let promo_id = promo.id;

  let user_name = user.fields['First Name'];
  let messenger_user_id = user.fields['messenger user id'];

  let call_practice_btn = createBtn(
    `Call Practice Again|show_block|[JSON] Call Practice`,
    { practice_id, promo_id }
  );

  let main_menu_btn = createBtn(
    `Main Menu|show_block|Main Menu`
  );

  let msg = createButtonMessage(
    `Hey ${user_name} you'll receive a call right now connecting you to ${practice_name} practice`,
    call_practice_btn,
    main_menu_btn,
  );

  return msg;
}

let createCustomerCall = async (data) => {
  let { practice, user, new_call_record_id, promo_id } = data;

  let practice_id = practice.id;

  let user_id = user.id;
  let user_phone_number = getNumbersOnly(user.fields['Phone Number']).slice(-10);

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

  let user_phone_number = user.fields['Phone Number'];
  let practice_leads_base_id = practice.fields['Practice Leads Base ID'];
  let promotion_name = promo.fields['Promotion Name'];

  let lead = await getUniqueLead(
    { practice_leads_base_id, user_phone_number, promotion_name }
  );

  let lead_data = {
    ['Call Initiated']: 'YES',
    ['Call Date / Time']: new Date()
  }

  let updated_lead = await updatePracticeLead(
    { practice_leads_base_id, lead_data, lead }
  );

  return updated_lead;
}

module.exports = {
  createCustomerMsg,
  createCustomerCall,
  updateLeadRecord,
}