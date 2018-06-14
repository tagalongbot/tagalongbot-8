// This library is used for users inside a practice base
let { BASEURL } = process.env;
let { createURL } = require('../../../libs/helpers.js');
let { getTable, getAllDataFromTable } = require('../../../libs/data.js');

let getUsersTable = getTable('Users');
let getPromosTable = getTable('Promos');

let getPracticeUser = async ({ user_messenger_id, provider_base_id }) => {
  let usersTable = getUsersTable(provider_base_id);
  let getUsers = getAllDataFromTable(usersTable);

  let filterByFormula = `{messenger user id} = '${user_messenger_id}'`;
  let [user] = await getUsers({ filterByFormula });
  return user;
}

let getUserPromos = async ({ provider_base_id, user_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let getPromos = getAllDataFromTable(promosTable);

  let view = 'Active Promos';
  let promos = await getPromos({ view });
  
  let matched_promos = promos.filter(
    promo => promo.fields['Claimed By Users'].includes(user_id)
  );

  return matched_promos;
}

module.exports = {
  getPracticeUser,
  getUserPromos,
}