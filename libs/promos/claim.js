let { BASEURL } = process.env;
let { createButtonMessage } = require('../../libs/bots.js');
let { createURL } = require('../../libs/helpers.js');

let { getUserByMessengerID, updateUser } = require('../../libs/data/users.js');
let { getPracticeUser, createPracticeUser, updatePracticeUser } = require('../../libs/data/practice/users.js');
let { getTable, createTableData, updateTableData } = require('../../libs/data.js');

let getPromosTable = getTable('Promos');

let createUserData = ({ messenger_user_id, first_name, last_name, gender, practice_state, practice_city, practice_zip_code }) => {
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

let updateUserFromAllUsersBase = async ({ user, user_email, user_data, practice_id }) => {
  let practice_ids = (user.fields['Practices Claimed Promos From'] || '').split(',');

  let new_practice_ids = [
    ...new Set([practice_id, ...practice_ids])
  ];

  let updateUserData = { 
    ['Practices Claimed Promos From']: new_practice_ids.join(','),
    ['Email Address']: user_email, 
    ...user_data 
  }

  let updated_user = await updateUser(updateUserData, user);

  return updated_user;
}

// Exposed Functions
let updatePromo = async ({ practice_base_id, promo, user, claimed_by_users }) => {
  let promosTable = getPromosTable(practice_base_id);
  let updatePromoFromTable = updateTableData(promosTable);

  let new_claimed_users = [
    ...new Set([user.id, ...claimed_by_users])
  ];

  let updateData = {
    'Total Claim Count': Number(promo.fields['Total Claim Count']) + 1,
    'Claimed By Users': new_claimed_users,
  }

  let updatedPromo = await updatePromoFromTable(updateData, promo);
  return updatedPromo;
}

// Refactor Data Clump
let createOrUpdateUser = async (data, { id: practice_id, fields: practice }) => {
  let { messenger_user_id, first_name, last_name, gender, user_email, user_phone_number } = data;

  let practice_base_id = practice['Practice Base ID'];
  let practice_state = practice['Practice State'];
  let practice_city = practice['Practice City'];
  let practice_zip_code = practice['Practice Zip Code'];

  let user_messenger_id = messenger_user_id;
  let user = await getUserByMessengerID(messenger_user_id);
  let practice_user = await getPracticeUser({ user_messenger_id, practice_base_id });

  let user_data = createUserData(
    { messenger_user_id, first_name, last_name, gender, practice_state, practice_city, practice_zip_code }
  );

  let updated_user = await updateUserFromAllUsersBase({ user, user_email, user_data, practice_id });

  if (!practice_user) {
    let newUser = await createPracticeUser({ practice_base_id, user_data });
    return newUser;
  }

  let updated_practice_user = await updatePracticeUser({ practice_base_id, user_data, practice_user });
  return updated_practice_user;
}

let createClaimedMsg = ({ data, updated_promo, practice_phone_number, practice_booking_url }) => {
  let { practice_id, practice_base_id, promo_id, first_name, last_name, gender, messenger_user_id } = data;

  let view_practice_url = createURL(
    `${BASEURL}/promos/practice`, 
    { practice_id, practice_base_id, promo_id, first_name, last_name, gender, messenger_user_id }
  );

  let btn1 = `View Provider|json_plugin_url|${view_practice_url}`;
  let btn2 = (practice_booking_url) ? `View Booking Site|web_url|${practice_booking_url}` : `Call Provider|phone_number|${practice_phone_number}`;
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