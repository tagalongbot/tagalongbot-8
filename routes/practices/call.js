let { BASEURL, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

let handleRoute = require('../../middlewares/handleRoute.js');

let express = require('express');
let router = express.Router();

let twilio = require('twilio');
let client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

let { VoiceResponse } = twilio.twiml;

let { getNumbersOnly, timeout } = require('../../libs/helpers.js');

let { getPracticeByID } = require('../../libs/data/practices.js');
let { getUserByID, getUserByMessengerID } = require('../../libs/data/users.js');

let { getPracticePromo } = require('../../libs/data/practice/promos.js');
let { getPracticeLead, updatePracticeLead } = require('../../libs/data/practice/leads.js');

let { createCallRecord, createCustomerMsg, createCustomerCall } = require('../../libs/practices/call.js');

let callPractice = async ({ query }, res) => {
  // This happens after customer claims promotions
  // Aware of which customer claimed the promo
  // Aware of which practice they claimed from

  let { practice_id, promo_id, messenger_user_id: user_messenger_id } = query;

  let practice = await getPracticeByID(practice_id);
  let practice_name = practice.fields['Practice Name'];

  let user = await getUserByMessengerID(user_messenger_id);
  let user_first_name = user.fields['First Name'];

  let msg = createCustomerMsg(
    { user_name: user_first_name, practice_name }
  );

  let messages = [msg];
  res.send({ messages });

  // Start the call 5 seconds after message is sent back to user on messenger
  await timeout(5000);
  let customer_call = await createCustomerCall(
    { practice, user, promo_id }
  );
}

let answerCustomer = async ({ query, params }, res) => {
  console.log('Customer Answered');
  let { user_id, practice_id, promo_id } = params;

  let user = await getUserByID(user_id);
  let user_first_name = user.fields['First Name'];

  let practice = await getPracticeByID(practice_id);
  let practice_name = practice.fields['Practice Name'];
  let practice_leads_base_id = practice.fields['Practice Leads Base ID'];
  let practice_phone_number = getNumbersOnly(practice.fields['Practice Phone Number']);

  let voice_response = new VoiceResponse();

  voice_response.say(
    `Hello ${user_first_name} thank you for claiming a promotion with ${practice_name}. One moment while I get you connected. Thank You For Using Bevl Beauty.`
  );

  let dial = voice_response.dial({
    callerId: TWILIO_PHONE_NUMBER,
    record: 'record-from-answer',
    timeout: 600,
    recordingStatusCallback: `${BASEURL}/practices/call/record/${practice_leads_base_id}`,
    recordingStatusCallbackEvent: 'completed',
  });

  let dial_number_options = {
    url: `${BASEURL}/practices/call/answered/practice/${user_id}/${practice_id}/${promo_id}`,
    statusCallback: `${BASEURL}/practices/call/ringing/practice/${user_id}/${practice_id}/${promo_id}`,
    statusCallbackEvent: 'ringing',
  }

  dial.number(
    dial_number_options, 
    `+1${practice_phone_number}`
  );

  res.set('Content-Type', 'text/xml');
  res.send(voice_response.toString());
}

let ringingPractice = async ({ params, body }) => {
  console.log('Ringing Practice', body);
  let { user_id, practice_id, promo_id } = params;

  let user = await getUserByID(user_id);
  
  let practice = await getPracticeByID(practice_id);
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let promo = await getPracticePromo({ practice_promos_base_id, promo_id });

  let new_call_record = await createCallRecord(
    { user, practice, promo }
  );
}

let answerPractice = async ({ query, params }, res) => {
  console.log('Practice Answered');
  let { user_id, practice_id, promo_id } = params;

  let practice = await getPracticeByID(practice_id);
  let practice_name = practice.fields['Practice Name'];
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let promo = await getPracticePromo({ practice_promos_base_id, promo_id });
  let promo_name = promo.fields['Promotion Name'];

  let user = await getUserByID(user_id);
  let user_name = `${user.fields['First Name']} ${user.fields['Last Name']}`;

  let voice_response = new VoiceResponse();

  voice_response.say(
    `Hello ${practice_name} you have a new lead ${user_name} that claimed the promotion ${promo_name}. Again ${user_name} who claimed ${promo_name}. Thank You For Using Bevl Beauty.`,
  );

  res.set('Content-Type', 'text/xml');
  res.send(voice_response.toString());
}

let saveCallRecording = async ({ query, params }, res) => {
  console.log('Saving Call');
  let { practice_leads_base_id, lead_record_id: lead_id } = params;

  let {
    CallSid: call_id,
    RecordingSid: recording_id,
    RecordingUrl: recording_url,
    RecordingDuration: recording_duration
  } = query;

  let lead = await getPracticeLead(
    { practice_leads_base_id, lead_id }
  );

  let lead_data = {
    ['Recording URL']: recording_url,
    ['Recording Duration']: recording_duration
  }

  let updated_call = await updatePracticeLead(
    { practice_leads_base_id, lead_data, lead_id }
  );

  res.sendStatus(200);
}

router.get(
  '/',
  handleRoute(callPractice, '[Error] Calling Customer')
);

router.post(
  '/answered/customer/:user_id/:practice_id/:promo_id',
  answerCustomer
);

router.post(
  '/ringing/practice/:user_id/:practice_id/:promo_id',
  ringingPractice
);

router.post(
  '/answered/practice/:user_id/:practice_id/:promo_id',
  answerPractice
);

router.get(
  '/record/:practice_calls_base_id/:lead_record_id',
  saveCallRecording
);

module.exports = router;