let { BASEURL, USERS_BASE_ID } = process.env;
let { createButtonMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getTable, getAllDataFromTable, findTableData, createTableData, updateTableData } = require('../libs/data');

let getUsersTable = getTable('Users');
let getPromosTable = getTable('Promos');

let allUsersTable = getUsersTable(USERS_BASE_ID);
let getAllUsers = getAllDataFromTable(allUsersTable);

let createOrUpdateUser = async ({ messenger_user_id, first_name, last_name, gender, provider_base_id, provider_state, provider_city, provider_zip_code }) => {
  let usersTable = getUsersTable(provider_base_id);
  let getUsers = getAllDataFromTable(usersTable);
  let createUser = createTableData(usersTable);

  let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
  let [user] = await getUsers({ filterByFormula });

  let userData = {
    'messenger user id': messenger_user_id,
    'First Name': first_name,
    'Last Name': last_name,
    'Gender': gender,
    'State': provider_state,
    'City': provider_city,
    'Zip Code': provider_zip_code,
  }

  if (!user) {
    let newUser = await createUser(userData);
    return newUser;
  }

  let updatedUser = updateTableData(userData, user);
  return updatedUser;
}

let claimPromotion = async ({ query }, res) => {
  let { provider_id, promo_id } = query;
  let { messenger_user_id, first_name, last_name, gender, provider_base_id, provider_state, provider_city, provider_zip_code } = query;
  let userData = { messenger_user_id, first_name, last_name, gender, provider_base_id, provider_state, provider_city, provider_zip_code };

  let promosTable = getPromosTable(provider_base_id);

  let findPromo = findTableData(promosTable);
  let updatePromo = updateTableData(promosTable);

  let promo = await findPromo(promo_id);

  if (!promo) {
    let redirect_to_blocks = [];
    res.send({ redirect_to_blocks });
    return;
  }
  
  let user = await createOrUpdateUser(userData);
  
  let updatePromoData = {
    'Total Claim Count': promo.fields['Total Claim Count'],
    'Claimed By Users': [user.id, ...promo.fields['Claimed By Users']],
  }
  
  let updatedPromo = await updatePromo(updatePromoData, promo);
}

module.exports = claimPromotion;