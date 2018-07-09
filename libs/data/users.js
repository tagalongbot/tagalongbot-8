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

let getUserPromos = async ({ user_id, view = 'Main View' }) => {
  let user = await findUser(user_id);
  
  let c
  
  let promosTable = getPromosTable(practice_promos_base_id);
  let getPromos = getAllDataFromTable(promosTable);

  let promos = await getPromos({ view });

  let matched_promos = promos.filter((promo) => { 
    let promo_claimed_by_users = convertLongTextToArray(
      promo.fields['Claimed By Users']
    );
    
    return promo_claimed_by_users.includes(user_id);
  });
  
  return matched_promos;
}

module.exports = {
  getUserByID,
  getUserByMessengerID,
  createUser,
  updateUser,
  getUserPromos,
}