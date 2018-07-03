let { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

let twilio = require('twilio');
let client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
let { VoiceResponse } = twilio.twiml;

let { getNumbersOnly } = require('../../libs/helpers.js');

let { getPracticeByID } = require('../../libs/data/practices.js');
let { getUserByMessengerID } = require('../../libs/data/users.js');

let createCustomerCall = async ({ id: user_id, fields: user }) => {
  let customer_xml_doc_url = `http://demo.twilio.com/docs/voice.xml`;
  let customer_phone_number = getNumbersOnly(user['Phone Number'].match(/\d/g));

  return client.calls.create(
    { url: customer_xml_doc_url, to: customer_phone_number, from: TWILIO_PHONE_NUMBER }
  );
}

let callPractice = async ({ query }, res) => {
  // This happens after customer claims promotions
  // Aware of which customer claimed the promo
  // Aware of which practice they claimed from

  let { practice_id, messenger_user_id: user_messenger_id } = query;

  let practice = await getPracticeByID(practice_id);
  let practice_users_base_id = practice.fields['Practice Users Base ID'];

  let user = await getUserByMessengerID(user_messenger_id);
  let call_created = await createCustomerCall(user);
  res.send('TEST');
}

module.exports = callPractice;