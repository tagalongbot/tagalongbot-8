let { BASEURL } = process.env;
let { createButtonMessage } = require('../../libs/bots.js');
let { createURL } = require('../../libs/helpers.js');

let { getUserByMessengerID, updateUser } = require('../../libs/data/users.js');
let { getPracticeUser, createPracticeUser, updatePracticeUser } = require('../../libs/data/practice/users.js');
let { getTable, createTableData, updateTableData } = require('../../libs/data.js');

let getPromosTable = getTable('Promos');

let createUserData = ({ messenger_user_id, first_name, last_name, gender, provider_state, provider_city, provider_zip_code }) => {
  let user_data = {
    'messenger user id': messenger_user_id,
    'First Name': first_name,
    'Last Name': last_name,
    'Gender': gender.toLowerCase(),
    'State': provider_state.toLowerCase(),
    'City': provider_city.toLowerCase(),
    'Zip Code': Number(provider_zip_code),
  }

  return user_data;
}

let updateUserFromAllUsersBase = async ({ user, user_email, user_data, provider_id }) => {
  let provider_ids = (user.fields['Practices Claimed Promos From'] || '').split(',');

  let new_provider_ids = [
    ...new Set([provider_id, ...provider_ids])
  ];

  let updateUserData = { 
    ['Practices Claimed Promos From']: new_provider_ids.join(','),
    ['Email Address']: user_email, 
    ...user_data 
  }

  let updated_user = await updateUser(updateUserData, user);

  return updated_user;
}

// Exposed Functions
let updatePromo = async ({ provider_base_id, promo, user, claimed_by_users }) => {
  let promosTable = getPromosTable(provider_base_id);
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

let createOrUpdateUser = async (data, { id: provider_id, fields: provider }) => {
  let { messenger_user_id, first_name, last_name, gender, user_email } = data;

  let provider_base_id = provider['Practice Base ID'];
  let provider_state = provider['Practice State'];
  let provider_city = provider['Practice City'];
  let provider_zip_code = provider['Practice Zip Code'];

  let user_messenger_id = messenger_user_id;
  let user = await getUserByMessengerID(messenger_user_id);
  let practice_user = await getPracticeUser({ user_messenger_id, provider_base_id });

  let user_data = createUserData({ messenger_user_id, first_name, last_name, gender, provider_state, provider_city, provider_zip_code });

  let updated_user = await updateUserFromAllUsersBase({ user, user_email, user_data, provider_id });

  if (!practice_user) {
    let newUser = await createPracticeUser({ provider_base_id, user_data });
    return newUser;
  }

  let updated_practice_user = await updatePracticeUser({ provider_base_id, user_data, practice_user });
  return updated_practice_user;
}

let createClaimedMsg = ({ data, updated_promo, provider_phone_number, provider_booking_url }) => {
  let { provider_id, provider_base_id, promo_id, first_name, last_name, gender, messenger_user_id } = data;

  let view_provider_url = createURL(
    `${BASEURL}/promos/provider`, 
    { provider_id, provider_base_id, promo_id, first_name, last_name, gender, messenger_user_id }
  );

  let btns = [
    `View Provider|json_plugin_url|${view_provider_url}`,
    `Call Provider|phone_number|${provider_phone_number}`,
  ]
  
  if (provider_booking_url) btns.push(`View Booking Site|web_url|${provider_booking_url}`);
  
  let msg = createButtonMessage(
    `Congrats ${first_name} your promotion "${updated_promo.fields['Promotion Name']}" has been claimed!`,
    ...btns
  );
  
  return msg;
}

module.exports = {
  updatePromo,
  createOrUpdateUser,
  createClaimedMsg,
}