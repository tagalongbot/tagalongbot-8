let handleRoute = require('../../middlewares/handleRoute.js');

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

let { getPracticeCall, createPracticeCall, updatePracticeCall } = require('../../libs/data/practice/calls.js');

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
  let practice_state = practice.fields['State'];
  let practice_city = practice.fields['City'];
  let practice_zip_code = practice.fields['Zip Code'];
  let practice_calls_base_id = practice.fields['Practice Calls Base ID'];
  let practice_phone_number = getNumbersOnly(practice.fields['Practice Phone Number']);

  let user = await getUserByMessengerID(user_messenger_id);
  let user_first_name = user.fields['First Name'];
  let user_last_name = user.fields['Last Name'];
  let user_gender = user.fields['Gender'];
  let user_phone_number = user.fields['Phone Number'];

  let msg = createCustomerMsg(
    { user_name: user_first_name, practice_name }
  );

  let messages = [msg];
  // res.send({ messages });

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

  // Start The Call Process 5 seconds after user receives message and call record is created in Airtable
  await timeout(5000);
  let call_created = await createCustomerCall(user);
  await timeout(10000);

  let voice_response = new VoiceResponse();

  voice_response.dial({
    callerId: `+1${practice_phone_number}`,
    record: 'record-from-answer',
    recordingStatusCallback: `${BASEURL}/practices/call/record/${practice_calls_base_id}/${new_call_record.id}`
  });

  voice_response.say('Goodbye');
  
  res.send(voice_response.toString());
}

let saveCallRecording = async ({ query, params }, res) => {
  let { practice_calls_base_id, call_record_id } = params;

  let {
    CallSid: call_id,
    RecordingSid: recording_id,
    RecordingUrl: recording_url,
    RecordingDuration: recording_duration
  } = query;

  let call = await getPracticeCall(
    { practice_calls_base_id, call_record_id }
  );

  let call_data = {
    ['Call ID']: call_id,
    ['Recording ID']: recording_id,
    ['Recording URL']: recording_url,
    ['Recording Duration']: recording_duration
  }

  console.log('call_data', call_data);

  // let updated_call = await updatePracticeCall(
  //   { practice_calls_base_id, call_data, call }
  // );

  res.sendStatus(200);
}

router.get(
  '/',
  handleRoute(callPractice, '[Error] Calling Customer')
);

router.get(
  '/record:practice_calls_base_id/:call_record_id',
  handleRoute(saveCallRecording, '[Error] Saving Call Recording')
);

module.exports = router;