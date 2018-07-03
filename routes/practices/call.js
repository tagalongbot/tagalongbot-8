let { handleRoute } = require('../../middlewares/handleRoute.js');

let { BASEURL, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, CUSTOMER_XML_DOC_URL } = process.env;

let twilio = require('twilio');
let client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

let express = require('express');
let router = express.Router();

let { VoiceResponse } = twilio.twiml;

let { createButtonMessage } = require('../../libs/bots.js');
let { getNumbersOnly, timeout } = require('../../libs/helpers.js');

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
  let practice_name = practice.fields['Practice Name'];
  let practice_phone_number = getNumbersOnly(practice.fields['Practice Phone Number']);

  let user = await getUserByMessengerID(user_messenger_id);
  let user_name = user.fields['First Name'];

  let msg = createCustomerMsg({ user_name, practice_name });
  let messages = [msg];
  // res.send({ messages });

  await timeout(5000);

  let call_created = await createCustomerCall(user);

  await timeout(5000);

  let voice_response = new VoiceResponse();

  voice_response.dial({
    callerId: `+1${practice_phone_number}`,
    record: 'record-from-answer',
    recordingStatusCallback: `${BASEURL}/practices/call/record`
  });

  voice_response.say('Goodbye');

  res.send(voice_response);
}

let saveCallRecording = async ({ query }, res) => {
  let { CallSid: call_id, RecordingSid } = query;
}

router.get(
  '/',
  handleRoute(callPractice, '[Error] Calling Customer')
);

router.get(
  '/record',
  handleRoute(saveCallRecording, '[Error] Saving Call Recording')
);

module.exports = router;