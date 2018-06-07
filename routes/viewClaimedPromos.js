let { USERS_BASE_ID } = process.env;

let { createURL } = require('../libs/helpers');
let { createMultiGallery } = require('../libs/bots');
let { getTable, getDataFromTable, getAllDataFromTable } = require('../libs/data');

let getUsersTable = getTable('Users');
let getPromosTable = getTable('Promos');

let { getUserByMessengerID } = require('../libs/users');

let getUserFromPracticeBase = async ({ practice_base_id, messenger_user_id }) => {
  let usersTable = getUsersTable(practice_base_id);
  let getUsers = getDataFromTable(usersTable);

  let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
  let [user] = await getUsers({ filterByFormula });

  return user;
}

let getPromosFromPracticeBase = async ({ practice_base_id }) => {
  let promosTable = getPromosTable(practice_base_id);
  let getPromos = getAllDataFromTable(promosTable);

  let view = 'Active Promos';
  let promos = await getPromos({ view });
  
  return promos;
}

let getUserPromos = (messenger_user_id) => async (practice_base_id) => {
  let user = getUserFromPracticeBase({ practice_base_id, messenger_user_id });
  let promos = getPromosFromPracticeBase({ practice_base_id, messenger_user_id });
  
  let promo_ids = user.fields['Promos Claimed'];

  let user_promos = promos.filter(
    promo => promo_ids.includes(promo.id)
  );
  
  r
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}

let viewClaimedPromos = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id'];

  let user = await getUserByMessengerID(messenger_user_id);
  
  let practice_base_ids = user.fields['Practices Claimed Promos From'].split(',');
  
  let promos = Promise.all(
    practice_base_ids.map(getUserPromos(messenger_user_id))
  );

  let galleryData = promos.map(toGalleryElement);

  let messages = createMultiGallery(galleryData);
  res.send({ messages });
}

module.exports = viewClaimedPromos;