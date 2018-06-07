let { BASEURL, PRACTICE_DATABASE_BASE_ID, USERS_BASE_ID } = process.env;
let { createButtonMessage, createTextMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');

let express = require('express');
let router = express.Router();

let { getTable, getAllDataFromTable, findTableData, createTableData, updateTableData } = require('../libs/data');

let getPracticesTable = getTable('Practices');
let getUsersTable = getTable('Users');
let getPromosTable = getTable('Promos');

let practicesTable = getPracticesTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practicesTable);

let allUsersTable = getUsersTable(USERS_BASE_ID);
let getAllUsers = getAllDataFromTable(allUsersTable);
let updateUserFromAllUsers = updateTableData(allUsersTable);

// Need To Refactor and Break This Function Up
let createOrUpdateUser = async ({ messenger_user_id, first_name, last_name, gender, user_email, provider_base_id }, provider) => {
  let usersTable = getUsersTable(provider_base_id);
  let getUsers = getAllDataFromTable(usersTable);
  let createUser = createTableData(usersTable);
  let updateUser = updateTableData(usersTable);

  let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
  let [user] = await getUsers({ filterByFormula });

  let provider_state = provider.fields['Practice State'];
  let provider_city = provider.fields['Practice City'];
  let provider_zip_code = provider.fields['Practice Zip Code'];

  let userData = {
    'messenger user id': messenger_user_id,
    'First Name': first_name,
    'Last Name': last_name,
    'Gender': gender.toLowerCase(),
    'State': provider_state.toLowerCase(),
    'City': provider_city.toLowerCase(),
    'Zip Code': Number(provider_zip_code),
  }

  let [userFromAllUsersTable] = await getAllUsers({ filterByFormula });
  let updatedUserFromAllUsers = await updateUserFromAllUsers({ 'Email Address': user_email, ...userData }, userFromAllUsersTable);

  if (!user) {
    let newUser = await createUser(userData);
    return newUser;
  }

  let updatedUser = await updateUser(userData, user);
  return updatedUser;
}

let askForUserEmail = async ({ query }, res) => {
  let { promo_id, provider_id } = query;

  let redirect_to_blocks = ['Ask For Email (Promo)'];
  let set_attributes = { promo_id, provider_id };
  res.send({ redirect_to_blocks, set_attributes });
}

// Need To Refactor and Break This Function Up
let claimPromotion = async ({ query }, res) => {
  let { promo_id, provider_id, gender, user_email } = query;
  let messenger_user_id = query['messenger user id'];
  let first_name = query['first name'];
  let last_name = query['last name'];

  let provider = await findPractice(provider_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let userData = { provider_id, provider_base_id, messenger_user_id, first_name, last_name, gender, user_email };

  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let updatePromo = updateTableData(promosTable);

  let promo = await findPromo(promo_id);

  if (!promo || promo.fields['Claim Limit Reached'] === "1") {
    let redirect_to_blocks = ['Promo No Longer Valid'];
    res.send({ redirect_to_blocks });
    return;
  }

  let user = await createOrUpdateUser(userData, provider);

  let claimed_by_users = promo.fields['Claimed By Users'] || [];
  if (claimed_by_users.includes(user.id)) {
    let redirect_to_blocks = ['Promo Already Claimed By User'];
    res.send({ redirect_to_blocks });
    return;
  }

  let claimed_users = [
    ...new Set([user.id, ...claimed_by_users])
  ];

  let updatePromoData = {
    'Total Claim Count': Number(promo.fields['Total Claim Count']) + 1,
    'Claimed By Users': claimed_users,
  }

  let updatedPromo = await updatePromo(updatePromoData, promo);

  let view_provider_url = createURL(`${BASEURL}/promo/provider`, { ...query, ...userData });

  let txtMsg = createButtonMessage(
    `Congrats ${first_name} your promotion "${updatedPromo.fields['Name']}" has been claimed!`,
    `View Provider|json_plugin_url|${view_provider_url}`,
    `Search More Promos|show_block|Search Promos`,
  );

  let messages = [txtMsg];
  res.send({ messages });
}

router.get('/email', askForUserEmail);
router.get('/', claimPromotion);

module.exports = router;