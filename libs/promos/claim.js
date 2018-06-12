let { BASEURL, PRACTICE_DATABASE_BASE_ID, USERS_BASE_ID } = process.env;
let { createButtonMessage, createTextMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');

let express = require('express');
let router = express.Router();

let { getTable, getAllDataFromTable, findTableData, createTableData, updateTableData } = require('../libs/data');

let getPracticesTable = getTable('Practices');
let practicesTable = getPracticesTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practicesTable);

let getUsersTable = getTable('Users');
let allUsersTable = getUsersTable(USERS_BASE_ID);
let getAllUsers = getAllDataFromTable(allUsersTable);
let updateUserFromAllUsers = updateTableData(allUsersTable);

let getPromosTable = getTable('Promos');

let getUser = async ({ user_messenger_id, provider_base_id }) => {
  let usersTable = getUsersTable(provider_base_id);
  let getUsers = getAllDataFromTable(usersTable);

  let filterByFormula = `{messenger user id} = '${user_messenger_id}'`;
  let [user] = await getUsers({ filterByFormula });
  return user;
}

let createOrUpdateUser = async (data, provider) => {
  let { messenger_user_id, first_name, last_name, gender, user_email, provider_base_id } = data;

  let createUser = createTableData(usersTable);
  let updateUser = updateTableData(usersTable);

  let user_messenger_id = messenger_user_id;
  let practice_user = await getUser({ user_messenger_id, provider_base_id });

  let provider_id = provider.id;
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

  let provider_ids = (userFromAllUsersTable.fields['Practices Claimed Promos From'] || '').split(',');

  let new_provider_ids = [
    ...new Set([provider_id, ...provider_ids])
  ];
  
  let updateUserData = { 
    ['Practices Claimed Promos From']: new_provider_ids.join(','),
    ['Email Address']: user_email, 
    ...userData 
  }
  
  let updatedUserFromAllUsers = await updateUserFromAllUsers(updateUserData, userFromAllUsersTable);

  if (!user) {
    let newUser = await createUser(userData);
    return newUser;
  }

  let updatedUser = await updateUser(userData, user);
  return updatedUser;
}