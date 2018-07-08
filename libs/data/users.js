let { USERS_BASE_ID } = process.env;

let { getTable, findTableData, getAllDataFromTable, createTableData, updateTableData } = require('../../libs/data.js');

let getUsersTable = getTable('Users');
let usersTable = getUsersTable(USERS_BASE_ID);

let findUser = findTableData(usersTable);
let getUsers = getAllDataFromTable(usersTable);
let createUserInTable = createTableData(usersTable);
let updateUserFromTable = updateTableData(usersTable);

let getUserByID = async (user_id) => {
  let user = await findUser(user_id);
  return user;
}

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
  getUserByID,
  getUserByMessengerID,
  createUser,
  updateUser,
}