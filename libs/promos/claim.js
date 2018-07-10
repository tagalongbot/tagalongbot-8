let { BASEURL } = process.env;

let { createButtonMessage, createQuickReplyMessage } = require('../../libs/bots.js');
let { createURL, convertLongTextToArray, getNumbersOnly } = require('../../libs/helpers.js');

let { getUserByMessengerID, updateUser } = require('../../libs/data/users.js');
let { updatePracticePromo } = require('../../libs/data/practice/promos.js');
let { createPracticeLead } = require('../../libs/data/practice/leads.js');

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

let updatePromo = async (data) => {
  let { practice, promo, user, claimed_by_users } = data;
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

let createLead = async (data) => {
  let { practice, promo, user } = data;

  let practice_name = practice.fields['Practice Name'];
  let practice_state = practice.fields['Practice State'];
  let practice_city = practice.fields['Practice City'];
  let practice_zip_code = practice.fields['Practice Zip Code'];
  let practice_leads_base_id = practice.fields['Practice Leads Base ID'];
  let practice_promos_base_url = practice.fields['Practice Promos Base URL'];
  let practice_phone_number = getNumbersOnly(practice.fields['Practice Phone Number']);

  let user_first_name = user.fields['First Name'];
  let user_last_name = user.fields['Last Name'];
  let user_gender = user.fields['Gender'];
  let user_phone_number = user.fields['Phone Number'];

  let promo_id = promo.id;
  let promo_name = promo.fields['Promotion Name'];

  let lead_data = {
    ['First Name']: user_first_name,
    ['Last Name']: user_last_name,
    ['Gender']: user_gender,
    ['State']: practice_state,
    ['City']: practice_city,
    ['Zip Code']: practice_zip_code,
    ['Phone Number']: user_phone_number,
    ['Claimed Promotion Name']: promo_name,
    ['Claimed Promotion URL']: `${practice_promos_base_url}/${promo_id}`
  }

  let new_lead_record = await createPracticeLead(
    { practice_leads_base_id, lead_data }
  );

  return new_lead_record;
}

let createClaimedMsg = (data) => {
  let { first_name, last_name, gender, messenger_user_id, practice, updated_promo } = data;

  let practice_id = practice.id;
  let practice_name = practice.fields['Practice Name'];
  let practice_phone_number = practice.fields['Practice Phone Number'];
  let practice_booking_url = practice.fields['Practice Booking URL'];
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let promo_id = updated_promo.id;
  let promotion_name = updated_promo.fields['Promotion Name'];

  let view_practice_url = createURL(
    `${BASEURL}/promos/practice`, 
    { practice_id, practice_promos_base_id, promo_id, first_name, last_name, gender, messenger_user_id }
  );

  let c
  
  let msg1 = createButtonMessage(
    `Congrats ${first_name} your promotion "${promotion_name}" has been claimed!`,
    `View Practice|json_plugin_url|${view_practice_url}`,
    `Main Menu|show_block|Discover Main Menu`
  );
  
  let msg2 = createQuickReplyMessage(
    `Would you like to call ${practice_name} now?`,
    `Yes|json_plugin_url|${}`
  );

  return [msg1, msg2];
}

module.exports = {
  updatePromo,
  updateClaimedUser,
  createLead,
  createClaimedMsg,
}