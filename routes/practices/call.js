let { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, CUSTOMER_XML_DOC_URL } = process.env;

let twilio = require('twilio');
let client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

let { VoiceResponse } = twilio.twiml;

let { createButtonMessage } = require('../../libs/bots.js');
let { getNumbersOnly } = require('../../libs/helpers.js');

let { getPracticeByID } = require('../../libs/data/practices.js');
let { getUserByMessengerID } = require('../../libs/data/users.js');

let createCustomerMsg = ({ user_name, practice_name }) => {
  let msg = createButtonMessage(
    `Hey ${user_name} you'll receive a call right now connecting you to ${practice_name} practice`,
    `Main Menu|show_block|Discover Main Menu`,
  );
  
  return msg;
}

let createCustomerCall = async ({ id: user_id, fields: user }) => {
  let customer_phone_number = getNumbersOnly(user['Phone Number']);

  return client.calls.create(
    { url: CUSTOMER_XML_DOC_URL, to: customer_phone_number, from: TWILIO_PHONE_NUMBER }
  );
}

let callPractice = async ({ query }, res) => {
  // This happens after customer claims promotions
  // Aware of which customer claimed the promo
  // Aware of which practice they claimed from

  let { practice_id, messenger_user_id: user_messenger_id } = query;

  let practice = await getPracticeByID(practice_id);
  console.log('practice', practice);
  let practice_name = practice.fields['Practice Name'];

  let user = await getUserByMessengerID(user_messenger_id);
  let user_name = user.fields['First Name'];

  let msg = createCustomerMsg({ user_name, practice_name });
  let messages = [msg];
  res.send({ messages });

  let call_created = await createCustomerCall(user);
}

module.exports = callPractice;