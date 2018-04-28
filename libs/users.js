let { USERS_BASE_ID } = process.env;
let { getTable, getAllDataFromTable, createTableData, updateTableData } = require('../libs/data');

let getUsersTable = getTable('Users');
let usersTable = getUsersTable(USERS_BASE_ID);

let getUsers = getAllDataFromTable(usersTable);

let searchUserByMessengerID = async (messenger_user_id) => {
	let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
	let [user] = await getUsers({ filterByFormula });
	return user;
}

module.exports = {
  searchUserByMessengerID,
}