let { BASEURL, PRACTICE_DATABASE_BASE_ID, USERS_BASE_ID } = process.env;
let { createButtonMessage, createTextMessage } = require('../libs/bots');
let { createURL } = require('../libs/helpers');
let { getTable, getAllDataFromTable, findTableData, createTableData, updateTableData } = require('../libs/data');

let getPracticesTable = getTable('Practices');
let getUsersTable = getTable('Users');
let getPromosTable = getTable('Promos');

let practicesTable = getPracticesTable(PRACTICE_DATABASE_BASE_ID);
let findPractice = findTableData(practicesTable);

let allUsersTable = getUsersTable(USERS_BASE_ID);
let getAllUsers = getAllDataFromTable(allUsersTable);

let createOrUpdateUser = async ({ messenger_user_id, first_name, last_name, gender, provider_base_id }, provider) => {
  let usersTable = getUsersTable(provider_base_id);
  let getUsers = getAllDataFromTable(usersTable);
  let createUser = createTableData(usersTable);

  let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
  let [user] = await getUsers({ filterByFormula });

  let provider_state = provider.fields['Practice State'];
  let provider_city = provider.fields['Practice City'];
  let provider_zip_code = provider.fields['Practice Zip Code'];

  let userData = {
    'messenger user id': messenger_user_id,
    'First Name': first_name,
    'Last Name': last_name,
    'Gender': gender,
    'State': provider_state,
    'City': provider_city,
    'Zip Code': provider_zip_code,
  }

  console.log('User Data', userData);

  if (!user) {
    let newUser = await createUser(userData);
    return newUser;
  }

  let updatedUser = updateTableData(userData, user);
  return updatedUser;
}

let claimPromotion = async ({ query }, res) => {
  let { promo_id, messenger_user_id, first_name, last_name, gender, provider_id, provider_base_id } = query;
  let userData = { messenger_user_id, first_name, last_name, gender, provider_id, provider_base_id };

  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let updatePromo = updateTableData(promosTable);

  let promo = await findPromo(promo_id);

  if (!promo) {
    let redirect_to_blocks = ['Promo No Longer Valid'];
    res.send({ redirect_to_blocks });
    return;
  }
  
  
  let provider = await findPractice(provider_id);
  let user = await createOrUpdateUser(userData, provider);
  console.log('User:', user);
  let updatePromoData = {
    'Total Claim Count': promo.fields['Total Claim Count'],
    'Claimed By Users': [user.id, ...promo.fields['Claimed By Users']],
  }
  
  let updatedPromo = await updatePromo(updatePromoData, promo);
  console.log(updatedPromo);
  let txtMsg = createTextMessage('Test');
  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = claimPromotion;