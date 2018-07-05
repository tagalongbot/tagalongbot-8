let { BASEURL } = process.env;

let { createButtonMessage } = require('../../libs/bots.js');
let { createURL, convertLongTextToArray } = require('../../libs/helpers.js');

let { getUserByMessengerID, updateUser } = require('../../libs/data/users.js');
let { updatePracticePromo } = require('../../libs/data/practice/promos.js');
let { getPracticeUser, createPracticeUser, updatePracticeUser } = require('../../libs/data/practice/users.js');

let createUserData = (data) => {
  let { 
    messenger_user_id = null, 
    first_name = null, 
    last_name = null, 
    gender = null, 
    practice_state = null, 
    practice_city = null, 
    practice_zip_code = null 
  } = data;

  let user_data = {
    'messenger user id': messenger_user_id,
    'First Name': first_name,
    'Last Name': last_name,
    'Gender': gender.toLowerCase(),
    'State': practice_state.toLowerCase(),
    'City': practice_city.toLowerCase(),
    'Zip Code': Number(practice_zip_code),
  }

  return user_data;
}

let updateUserFromAllUsersBase = async ({ practice_id, user, user_email, user_phone_number, user_data }) => {
  let practice_ids = (user.fields['Practices Claimed Promos From'] || '').split('\n');

  let new_practice_ids = [
    ...new Set([practice_id, ...practice_ids])
  ];

  let updateUserData = { 
    ['Practices Claimed Promos From']: new_practice_ids.join('\n'),
    ['Email Address']: user_email,
    ['Phone Number']: user_phone_number,
    ...user_data 
  }

  let updated_user = await updateUser(updateUserData, user);
  return updated_user;
}

// Exposed Functions
let updatePromo = async ({ practice_promos_base_id, practice_users_base_id, promo, practice_user, claimed_by_users }) => {
  let practice_user_claimed_promos = convertLongTextToArray(practice_user.fields['Promos Claimed']);

  let new_claimed_promos = [
    ...new Set([promo.id, ...practice_user_claimed_promos])
  ];

  let user_data = {
    ['Promos Claimed']: new_claimed_promos.join('\n'),
  }

  let updated_user = await updatePracticeUser(
    { practice_users_base_id, user_data, practice_user }
  );

  // Update Promo Data
  let new_claimed_users = [
    ...new Set([practice_user.id, ...claimed_by_users])
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

let createOrUpdateUser = async (data, { id: practice_id, fields: practice }) => {
  let { messenger_user_id, first_name, last_name, gender, user_email, user_phone_number } = data;

  let practice_users_base_id = practice['Practice Users Base ID'];
  let practice_state = practice['Practice State'];
  let practice_city = practice['Practice City'];
  let practice_zip_code = practice['Practice Zip Code'];

  let user_messenger_id = messenger_user_id;

  let user = await getUserByMessengerID(messenger_user_id);

  let practice_user = await getPracticeUser(
    { user_messenger_id, practice_users_base_id }
  );

  let user_data = createUserData(
    { messenger_user_id, first_name, last_name, gender, practice_state, practice_city, practice_zip_code }
  );

  let updated_user = await updateUserFromAllUsersBase(
    { practice_id, user, user_email, user_phone_number, user_data, practice_id }
  );

  if (!practice_user) {
    let newUser = await createPracticeUser(
      { practice_users_base_id, user_data }
    );

    return newUser;
  }

  let updated_practice_user = await updatePracticeUser(
    { practice_users_base_id, user_data, practice_user }
  );

  return updated_practice_user;
}

let createClaimedMsg = ({ data, updated_promo, practice_phone_number, practice_booking_url }) => {
  let { practice_id, practice_promos_base_id, promo_id, first_name, last_name, gender, messenger_user_id } = data;

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
  createOrUpdateUser,
  createClaimedMsg,
}