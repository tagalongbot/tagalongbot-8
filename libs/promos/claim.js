let { createBtn, createButtonMessage, createQuickReplyMessage } = require('../../libs/bots.js');
let { convertLongTextToArray, getNumbersOnly } = require('../../libs/helpers.js');

let { getUserByMessengerID, createUser } = require('../../libs/data/users.js');
let { updatePracticePromo } = require('../../libs/data/practice/promos.js');
let { createPracticeLead } = require('../../libs/data/practice/leads.js');

let createNewUserData = (data) => {
  let { state, city, zip_code, user_data } = data;
  let { messenger_user_id, first_name, last_name, gender, user_email, user_phone_number } = user_data;

  let new_user_data = {
    ['messenger user id']: messenger_user_id,
    ['First Name']: first_name,
    ['Last Name']: last_name,
    ['Gender']: gender.toLowerCase(),
    ['Email Address']: user_email,
    ['Phone Number']: getNumbersOnly(user_phone_number).slice(-10),
    ['State']: state.toUpperCase() || null,
    ['City']: city.toUpperCase() || null,
    ['Zip Code']: Number(zip_code.trim()) || null,
    ['Last Zip Code Searched']: Number(zip_code.trim()) || null,
  }
  
  return new_user_data;  
}

let getOrCreateUser = async (data) => {
  let { state, city, zip_code, user_data } = data;
  let { messenger_user_id } = user_data;

  let new_user_data = createNewUserData(
    { state, city, zip_code, user_data }
  );

  let user = await getUserByMessengerID(messenger_user_id);

  if (!user) {
    
  }
      
  let updated_user = await updateUser(updateUserData, user);
  return updated_user;

}

// Exposed Functions
let createClaimedUser = async (data) => {
  let { practice, promo, state, city, zip_code, user_data } = data;

  let user = await getOrCreateUser(
    { practice, promo, state, city, zip_code, user_data }
  );

  let already_claimed_promos_data = convertLongTextToArray(
    user.fields['Claimed Promos']
  );

  let practice_id = practice.id;
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let new_claimed_promo_data = `${practice_id}-${practice_promos_base_id}-${promo.id}`;

  let claimed_promos = [
    ...new Set([new_claimed_promo_data, ...already_claimed_promos_data])
  ];

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
  let practice_leads_base_id = practice.fields['Practice Leads Base ID'];
  let practice_promos_base_url = practice.fields['Practice Promos Base URL'];
  
  let user_first_name = user.fields['First Name'];
  let user_last_name = user.fields['Last Name'];
  let user_gender = user.fields['Gender'];
  let user_phone_number = user.fields['Phone Number'];

  let promo_id = promo.id;
  let promo_name = promo.fields['Promotion Name'];

  let lead_data = {
    ['Call Initiated']: 'NO',
    ['First Name']: user_first_name,
    ['Last Name']: user_last_name,
    ['Gender']: user_gender,
    ['Phone Number']: user_phone_number,
    ['Claimed Promotion Name']: promo_name,
    ['Claimed Promotion URL']: `${practice_promos_base_url}/${promo_id}`
  }

  let updated_lead_record = await createPracticeLead(
    { practice_leads_base_id, lead_data }
  );

  return updated_lead_record;
}

let createClaimedMsg = (data) => {
  let { practice, updated_promo, user_data } = data;
  let { messenger_user_id, first_name, last_name, gender } = user_data;

  let practice_id = practice.id;
  let practice_name = practice.fields['Practice Name'];
  let practice_promos_base_id = practice.fields['Practice Promos Base ID'];

  let promo_id = updated_promo.id;
  let promotion_name = updated_promo.fields['Promotion Name'];

  let view_promo_practice_btn = createBtn(
    `View Promo Practice|show_block|[JSON] View Promo Practice`,
    { practice_id, practice_promos_base_id, promo_id }
  );

  let call_practice_btn = createBtn(
    `Yes|show_block|[JSON] Call Practice`,
    { practice_id, promo_id }
  );

  let no_call_practice_btn = createBtn(
    `No|show_block|[JSON] No Practice Call`,
    { practice_id, promo_id }
  );

  let main_menu_btn = createBtn(
    `Main Menu|show_block|Main Menu`,
  );

  let msg1 = createButtonMessage(
    `Congrats ${first_name} your promotion "${promotion_name}" has been claimed!`,
    view_promo_practice_btn,
    main_menu_btn,
  );
  
  let msg2 = createQuickReplyMessage(
    `Would you like to call ${practice_name} now?`,
    call_practice_btn,
    no_call_practice_btn
  );

  return [msg1, msg2];
}

let createNoCallMsg = (data) => {
  let { practice, promo_id, first_name, last_name, gender, messenger_user_id } = data;

  let practice_id = practice.id;
  let practice_name = practice.fields['Practice Name'];

  let call_practice_btn = createBtn(
    `Call Practice|show_block|[JSON] Call Practice`,
    { practice_id, promo_id }
  );

  let main_menu_btn = createBtn(
    `Main Menu|show_block|Main Menu`,
  );

  let msg = createButtonMessage(
    `Hey ${first_name} whenever you're ready to call ${practice_name} just click the button below`,
    call_practice_btn,
    main_menu_btn,
  );

  return msg;
}

module.exports = {
  updatePromo,
  createClaimedUser,
  createLead,
  createClaimedMsg,
  createNoCallMsg,
}