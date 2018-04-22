let { BASEURL, USERS_BASE_ID } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getTable, getAllDataFromTable, findTableData, createTableData, updateTableData } = require('../libs/data');

let getUsersTable = getTable('Users');
let getPromosTable = getTable('Promos');

let allUsersTable = getUsersTable(USERS_BASE_ID);
let getAllUsers = getAllDataFromTable(allUsersTable);

let searchUser = () => {
}

let createOrUpdateUser = async ({ provider_base_id, messenger_user_id }) => {
  let usersTable = getUsersTable(provider_base_id);
  let getUsers = getAllDataFromTable(usersTable);
  let createUser = createTableData(usersTable);

  let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
  let [user] = await getUsers({ filterByFormula });

  if (!user) {
    let newUserData = {};
    let newUser = await createUser(newUserData);
    return newUser;
  }
  
  return user;
}

let claimPromotion = async ({ query }, res) => {
  let { provider_id, provider_base_id, promo_id, messenger_user_id } = query;

  let promosTable = getPromosTable(provider_base_id);

  let findPromo = findTableData(promosTable);

  let promo = await findPromo(promo_id);

  if (!promo) {
    let redirect_to_blocks = [];
    res.send({ redirect_to_blocks });
    return;
  }
  
  let updatePromoData = {
    
  }
}

module.exports = claimPromotion;