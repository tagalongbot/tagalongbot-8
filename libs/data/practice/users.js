// This library is used for users inside a practice base
let { getTable, getAllDataFromTable, createTableData, updateTableData } = require('../../../libs/data.js');

let getUsersTable = getTable('Users');
let getPromosTable = getTable('Promos');

let getPracticeUser = async ({ provider_base_id, user_messenger_id }) => {
  let usersTable = getUsersTable(provider_base_id);
  let getUsers = getAllDataFromTable(usersTable);

  let filterByFormula = `{messenger user id} = '${user_messenger_id}'`;
  let [user] = await getUsers({ filterByFormula });
  return user;
}

let createPracticeUser = async ({ provider_base_id, user_data }) => {
  let usersTable = getUsersTable(provider_base_id);
  let createUser = createTableData(usersTable);

  let new_user = await createUser(user_data);
  return new_user;
}

let updatePracticeUser = async ({ provider_base_id, user_data, practice_user }) => {
  let usersTable = getUsersTable(provider_base_id);
  let updateUser = updateTableData(usersTable);
  
  let updated_user = await updateUser(user_data, practice_user);
  return updated_user;
}

let getUserPromos = async ({ provider_base_id, user_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let getPromos = getAllDataFromTable(promosTable);

  let view = 'Active Promos';
  let promos = await getPromos({ view });

  let matched_promos = promos.filter(
    promo => (promo.fields['Claimed By Users'] || []).includes(user_id)
  );

  return matched_promos;
}

module.exports = {
  getPracticeUser,
  createPracticeUser,
  updatePracticeUser,
  getUserPromos,
}