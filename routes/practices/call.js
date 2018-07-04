let { BASEURL, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

let handleRoute = require('../../middlewares/handleRoute.js');

let express = require('express');
let router = express.Router();

let twilio = require('twilio');
let client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

let { VoiceResponse } = twilio.twiml;

let { getNumbersOnly, timeout } = require('../../libs/helpers.js');

let { getPracticeByID } = require('../../libs/data/practices.js');
let { getUserByMessengerID } = require('../../libs/data/users.js');

let { getPracticeCall, updatePracticeCall } = require('../../libs/data/practice/calls.js');

let { createCallRecord, createCustomerMsg, createCustomerCall } = require('../../libs/practices/call.js');

let callPractice = async ({ query }, res) => {
  // This happens after customer claims promotions
  // Aware of which customer claimed the promo
  // Aware of which practice they claimed from

  let { practice_id, messenger_user_id: user_messenger_id } = query;

  let practice = await getPracticeByID(practice_id);
  let practice_name = practice.fields['Practice Name'];

  let user = await getUserByMessengerID(user_messenger_id);
  let user_first_name = user.fields['First Name'];

  let new_call_record = await createCallRecord(
    { practice, user, user_messenger_id }
  );

  let new_call_record_id = new_call_record.id;

  let msg = createCustomerMsg(
    { user_name: user_first_name, practice_name }
  );

  let messages = [msg];
  res.send({ messages });

  // Start The Call Process 5 seconds after user receives message and call record is created in Airtable
  await timeout(5000);
  let customer_call = await createCustomerCall(
    { practice, user, new_call_record_id }
  );
}

let answerCustomer = async ({ query, params }, res) => {
  let { practice_id, new_call_record_id } = params;

  let practice = await getPracticeByID(practice_id);
  let practice_name = practice.fields['Practice Name'];
  let practice_calls_base_id = practice.fields['Practice Calls Base ID'];
  let practice_phone_number = getNumbersOnly(practice.fields['Practice Phone Number']);

  let voice_response = new VoiceResponse();

  voice_response.say(
    `Hey thank you for claiming a promotion with ${practice_name} via Bevl Beauty. One moment while I connect you to the practice you claimed a promotion from`
  );

  voice_response.play(
    { loop: 5 },
    'http://demo.twilio.com/docs/classic.mp3'
  );

  let dial = voice_response.dial({
    callerId: TWILIO_PHONE_NUMBER,
    record: 'record-from-answer',
    recordingStatusCallback: `${BASEURL}/practices/call/record/${practice_calls_base_id}/${new_call_record_id}`
  });

  dial.number(`+1${practice_phone_number}`);

  res.set('Content-Type', 'text/xml');
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

  let updated_call = await updatePracticeCall(
    { practice_calls_base_id, call_data, call }
  );

  res.sendStatus(200);
}

router.get(
  '/',
  handleRoute(callPractice, '[Error] Calling Customer')
);

router.get(
  '/answered/customer/:practice_id/:new_call_record_id',
  answerCustomer
);

router.get(
  '/record:practice_calls_base_id/:call_record_id',
  handleRoute(saveCallRecording, '[Error] Saving Call Recording')
);

module.exports = router;