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
  let updateUser = updateTableData(usersTable);

  let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
  let [user] = await getUsers({ filterByFormula });

  let provider_state = provider.fields['Practice State'];
  let provider_city = provider.fields['Practice City'];
  let provider_zip_code = provider.fields['Practice Zip Code'];

  let userData = {
    'messenger user id': messenger_user_id,
    'First Name': first_name,
    'Last Name': last_name,
    'Gender': gender.toLowerCase(),
    'State': provider_state.toLowerCase(),
    'City': provider_city.toLowerCase(),
    'Zip Code': Number(provider_zip_code),
  }

  if (!user) {
    let newUser = await createUser(userData);
    return newUser;
  }

  let updatedUser = await updateUser(userData, user);
  return updatedUser;
}

let toUniqueArray = (arr, val) => {
  if ( !arr.includes(val) ) {
    return arr.concat(val);
  }
  return arr;
}

let claimPromotion = async ({ query }, res) => {
  let { promo_id, messenger_user_id, first_name, last_name, gender1, provider_id, provider_base_id } = query;
  let userData = { messenger_user_id, first_name, last_name, gender: gender1, provider_id, provider_base_id };
  let data = { ...query, ...userData };

  let promosTable = getPromosTable(provider_base_id);
  let findPromo = findTableData(promosTable);
  let updatePromo = updateTableData(promosTable);

  let promo = await findPromo(promo_id);

  if (!promo || promo.fields['Claim Limit Reached'] === "1") {
    let redirect_to_blocks = ['Promo No Longer Valid'];
    res.send({ redirect_to_blocks });
    return;
  }
  
  let provider = await findPractice(provider_id);
  let user = await createOrUpdateUser(userData, provider);

  if (promo.fields['Claimed By Users'].includes(user.id)) {
    let redirect_to_blocks = ['Promo Already Claimed By User'];
    res.send({ redirect_to_blocks });
    return;
  }
  
  let claimed_users = [user.id, ...(promo.fields['Claimed By Users'] || [])].reduce(toUniqueArray, []);
  let updatePromoData = {
    'Total Claim Count': Number(promo.fields['Total Claim Count']) + 1,
    'Claimed By Users': claimed_users,
  }

  let updatedPromo = await updatePromo(updatePromoData, promo);
  
  let view_provider_url = createURL(`${BASEURL}/promo/provider`, data);

  let txtMsg = createButtonMessage(
    `Congrats ${first_name} your promotion has been claimed!`,
    `View Provider|json_plugin_url|${view_provider_url}`,
    `Search More Promos|show_block|Search Promos`,
  );

  let messages = [txtMsg];
  res.send({ messages });
}

module.exports = claimPromotion;