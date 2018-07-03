let { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

let twilio = require('twilio');
let client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
let { VoiceResponse } = twilio.twiml;

let { getPracticeByID } = require('../../libs/data/practices.js');
let { getUserByMessengerID } = require('../../libs/data/users.js');

let callCustomer = () => {
  let customer_xml_doc_url = `http://demo.twilio.com/docs/voice.xml`;
  let call_options = {}

  client.calls.create(call_options);
}

let callPractice = async ({ query }, res) => {
  // This happens after customer claims promotions
  // Aware of which customer claimed the promo
  // Aware of which practice they claimed from

  let { practice_id, messenger_user_id: user_messenger_id } = query;

  let practice = await getPracticeByID(practice_id);
  let practice_users_base_id = practice.fields['Practice Users Base ID'];

  let user = await getUserByMessengerID(user_messenger_id);
  console.log('user phone number', user.fields['Phone Number']);

  // let call_created = callCustomer();
  res.send('TEST');
}

module.exports = callPractice;