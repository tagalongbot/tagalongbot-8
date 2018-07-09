let { BASEURL } = process.env;

let { createButtonMessage } = require('../../libs/bots.js');
let { createURL, convertLongTextToArray } = require('../../libs/helpers.js');

let { getUserByMessengerID, updateUser } = require('../../libs/data/users.js');
let { updatePracticePromo } = require('../../libs/data/practice/promos.js');

// Exposed Functions
let updateClaimedUser = async (data) => {
  let { practice, promo, messenger_user_id, first_name, last_name, gender, user_email, user_phone_number } = data;

  let user = await getUserByMessengerID(messenger_user_id);
  let already_claimed_promos_data = user.fields['Claimed Promos'];

  let practice_id = practice.id;
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];
  let practice_state = practice.fields['Practice State'];
  let practice_city = practice.fields['Practice City'];
  let practice_zip_code = practice.fields['Practice Zip Code'];

  let new_claimed_promo_data = `${practice_id}-${practice_promos_base_id}-${promo.id}`;

  let claimed_promos = [
    ...new Set([new_claimed_promo_data, ...already_claimed_promos_data])
  ];

  let updateUserData = {
    ['Email Address']: user_email,
    ['Phone Number']: user_phone_number,
    ['messenger user id']: messenger_user_id,
    ['First Name']: first_name,
    ['Last Name']: last_name,
    ['Gender']: gender.toLowerCase(),
    ['State']: practice_state.toLowerCase(),
    ['City']: practice_city.toLowerCase(),
    ['Zip Code']: Number(practice_zip_code),
    ['Claimed Promos']: claimed_promos.join('\n')
  }

  let updated_user = await updateUser(updateUserData, user);
  return updated_user;
}

let updatePromo = async ({ practice, promo, user, claimed_by_users }) => {
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let new_claimed_users = [
    ...new Set([user.id, ...claimed_by_users])
  ];

  let promo_data = {
    ['Total Claim Count']: Number(promo.fields['Total Claim Count']) + 1,
    ['Claimed By Users']: new_claimed_users.join('\n'),
  }

  let updated_promo = await updatePracticePromo(
    { practice_promos_base_id, promo_data, promo }
  );

  return updated_promo;
}

let createClaimedMsg = (data) => {
  let { first_name, last_name, gender, messenger_user_id, practice, updated_promo } = data;

  let practice_id = practice.id;
  let practice_phone_number = practice.fields['Practice Phone Number'];
  let practice_booking_url = practice.fields['Practice Booking URL'];
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let promo_id = updated_promo.id;

  let view_practice_url = createURL(
    `${BASEURL}/promos/practice`, 
    { practice_id, practice_promos_base_id, promo_id, first_name, last_name, gender, messenger_user_id }
  );

  let call_practice_url = createURL(
    `${BASEURL}/practices/call`,
    { practice_id, messenger_user_id, promo_id }
  );

  let btn1 = `View Provider|json_plugin_url|${view_practice_url}`;
  let btn2 = (practice_booking_url) ? `View Booking Site|web_url|${practice_booking_url}` : `Call Provider|json_plugin_url|${call_practice_url}`;
  let btn3 = `Main Menu|show_block|Discover Main Menu`;

  let msg = createButtonMessage(
    `Congrats ${first_name} your promotion "${updated_promo.fields['Promotion Name']}" has been claimed!`,
    ...[btn1, btn2, btn3]
  );

  return msg;
}

module.exports = {
  updatePromo,
  updateClaimedUser,
  createClaimedMsg,
}