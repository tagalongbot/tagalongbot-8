let { BASEURL, PRACTICE_DATABASE_BASE_ID, USERS_BASE_ID } = process.env;

let { createURL, flattenArray } = require('../libs/helpers');
let { createMultiGallery } = require('../libs/bots');
let { getTable, getDataFromTable, getAllDataFromTable, findTableData } = require('../libs/data');

let getUsersTable = getTable('Users');
let getPromosTable = getTable('Promos');
let getPracticesTable = getTable('Practices');
let practicesTable = getPracticesTable(PRACTICE_DATABASE_BASE_ID);
let findProvider = findTableData(practicesTable);

let { getUserByMessengerID } = require('../libs/users');

let getUserFromPracticeBase = async ({ provider_base_id, messenger_user_id }) => {
  let usersTable = getUsersTable(provider_base_id);
  let getUsers = getDataFromTable(usersTable);

  let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
  let [user] = await getUsers({ filterByFormula });

  return user;
}

let getPromosFromPracticeBase = async ({ provider_base_id }) => {
  let promosTable = getPromosTable(provider_base_id);
  let getPromos = getAllDataFromTable(promosTable);

  let view = 'Active Promos';
  let promos = await getPromos({ view });
  
  return promos;
}

let getUserPromos = ({ messenger_user_id, data }) => async (provider_id) => {
  let provider = await findProvider(provider_id);
  let provider_base_id = provider.fields['Practice Base ID'];

  let user = getUserFromPracticeBase({ provider_base_id, messenger_user_id });
  let promos = getPromosFromPracticeBase({ provider_base_id, messenger_user_id });
  
  let promo_ids = user.fields['Promos Claimed'];

  let user_promos = promos.filter(
    promo => promo_ids.includes(promo.id)
  );
  
  return user_promos.map(toGalleryElement({ provider_id, provider_base_id, ...data }));
}

let toGalleryElement = (data) => ({ id: promo_id, fields: promo }) => {
  let title = promo['Promotion Name'];
  let subtitle = `Promo Expires On ${promo['Expiration Date']}`;
  let image_url = promo['Image URL'];

  let get_promo_id_url = createURL(`${BASEURL}/promo/id`, { promo_id, ...data });
  let view_promo_provider_url = createURL(`${BASEURL}/promo/provider`, { promo_id, ...data });

  let btn1 = {
    title: 'Get Promo ID',
    type: 'json_plugin_url',
    url: get_promo_id_url
  }

  let btn2 = {
    title: 'View Promo Provider',
    type: 'json_plugin_url',
    url: view_promo_provider_url
  }

  let buttons = [btn1, btn2];

  return { title, subtitle, image_url, buttons };
}

let viewClaimedPromos = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id'] || query['messenger_user_id'];
  let first_name = query['first name'] || query['first_name'];
  let last_name = query['last name'] || query['last_name'];
  let gender = query['gender'] || query['gender'];
  let data = { first_name, last_name, gender1: gender, messenger_user_id };

  let user = await getUserByMessengerID(messenger_user_id);

  let practice_ids = (user.fields['Practices Claimed Promos From'] || '').split(',');

  let promos = practice_ids.map(
    getUserPromos({ messenger_user_id, data })
  );

  let galleryData = flattenArray(
    Promise.all(promos)
  );

  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

module.exports = viewClaimedPromos;