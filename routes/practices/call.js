let { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

let twilio = require('twilio');
let client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
let { VoiceResponse } = twilio.twiml;

let { getPracticeByID } = require('../../libs/data/practices.js');
let { getPracticeUser } = require('../../libs/data/practice/users.js');
let { getUserByMessengerID } = require('../../libs/data/users.js');

let callPractice = async ({ query }, res) => {
  // This happens after customer claims promotions
  // Aware of which customer claimed the promo
  // Aware of which practice they claimed from

  let { practice_id, messenger_user_id: user_messenger_id } = query;

  let practice = await getPracticeByID(practice_id);
  let practice_users_base_id = practice.fields['Practice Users Base ID'];
  
  let practice_user = await getPracticeUser({ practice_users_base_id, user_messenger_id });
  let user = await getUserByMessengerID(user_messenger_id);
  
  let new_voice_response = new VoiceResponse();
  
  
}

module.exports = callPractice;