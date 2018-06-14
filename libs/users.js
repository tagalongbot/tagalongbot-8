let { USERS_BASE_ID } = process.env;
let { getTable, getAllDataFromTable, createTableData, updateTableData } = require('../libs/data.js');

let getUsersTable = getTable('Users');
let usersTable = getUsersTable(USERS_BASE_ID);

let getUsers = getAllDataFromTable(usersTable);
let createUserInTable = createTableData(usersTable);
let updateUserFromTable = updateTableData(usersTable);

let getUserByMessengerID = async (messenger_user_id) => {
	let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
	let [user] = await getUsers({ filterByFormula });
	return user;
}

let createUser = async (userData) => {
  let newUser = await createUserInTable(userData);
  return newUser;
}

let updateUser = async (userData, user) => {
  let updatedUser = await updateUserFromTable(userData, user);
  return updatedUser;
}

module.exports = {
  getUserByMessengerID,
  createUser,
  updateUser,
}