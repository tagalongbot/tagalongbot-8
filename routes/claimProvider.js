let { BASEURL, PRACTICE_DATABASE_BASE_ID } = process.env;
let { createButtonMessage, createTextMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');

let express = require('express');
let router = express.Router();

let { getTable, getAllDataFromTable, findTableData, createTableData, updateTableData } = require('../libs/data');

let getPracticesTable = getTable('Practices');

let practicesTable = getPracticesTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practicesTable);
let getPractices = getAllDataFromTable(practicesTable);

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

  // console.log('Updated User:', updatedUserFromAllUsers);
  if (!user) {
    let newUser = await createUser(userData);
    return newUser;
  }

  let updatedUser = await updateUser(userData, user);
  return updatedUser;
}

let askForUserEmail = async ({ query }, res) => {
  let { provider_id } = query;

  let redirect_to_blocks = ['Ask For Email (Practice)'];
  let set_attributes = { provider_id };
  res.send({ redirect_to_blocks, set_attributes });
}

let claimProvider = async ({ query }, res) => {
  let { promo_id, provider_id, gender, user_email } = query;
  let messenger_user_id = query['messenger user id'];
  let first_name = query['first name'];
  let last_name = query['last name'];

  // console.log('Query:', query);
  let provider = await findPractice(provider_id);

  let userData = { provider_id, messenger_user_id, first_name, last_name, gender, user_email };
  

  
  
  
  let txtMsg = createButtonMessage(
    `Congrats ${first_name} your practice has been claimed!`,
    `Search More Providers|show_block|Search Providers`,
  );

  let messages = [txtMsg];
  res.send({ messages });
}

router.get('/email', askForUserEmail);
router.get('/', claimProvider);

module.exports = router;