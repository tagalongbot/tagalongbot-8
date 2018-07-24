let { USERS_BASE_ID } = process.env;

let { convertLongTextToArray, flattenArray } = require('../../libs/helpers.js');

let { getTable, findTableData, getAllDataFromTable, createTableData, updateTableData } = require('../../libs/data.js');

let getPromosTable = getTable('Promos');

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

let getUserPromos = async ({ user_id, view = 'Active Promos' }) => {
  let user = await findUser(user_id);

  let claimed_promos_data = convertLongTextToArray(
    user.fields['Claimed Promos']
  );

  let practice_promos_base_ids = claimed_promos_data.map(
    (data) => data.split('-')[1]
  );

  let unique_practice_promos_base_ids = [
    ...new Set(practice_promos_base_ids)
  ];

  let practice_promos_by_ids_obj = unique_practice_promos_base_ids.reduce((obj, practice_promos_base_id) => {
    let practice_promos_ids = claimed_promos_data.filter(
      (data) => data.includes(practice_promos_base_id)
    ).map(
      (data) => data.split('-')[2]
    );

    return { ...obj, [practice_promos_base_id]: practice_promos_ids };
  }, {});

  let all_practice_promos = unique_practice_promos_base_ids.map(async (practice_promos_base_id) => {
    let promosTable = getPromosTable(practice_promos_base_id);
    let getPromos = getAllDataFromTable(promosTable);

    let practice_promos = await getPromos({ view });

    let matching_practice_promos = practice_promos.filter(
      (promo) => practice_promos_by_ids_obj[practice_promos_base_id].includes(promo.id)
    );

    return matching_practice_promos;
  });

  let all_promos = flattenArray(
    await Promise.all(all_practice_promos)
  );

  return all_promos;
}

module.exports = {
  getUserByID,
  getUserByMessengerID,
  createUser,
  updateUser,
  getUserPromos,
}