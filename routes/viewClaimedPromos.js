let { USERS_BASE_ID } = process.env;

let { createURL } = require('../libs/helpers');
let { createMultiGallery } = require('../libs/bots');
let { getTable, getDataFromTable, getAllDataFromTable } = require('../libs/data');

let getUsersTable = getTable('Users');
let getPromosTable = getTable('Promos');

let { getUserByMessengerID } = require('../libs/users');

let getUserFromPracticeBase = async ({ practice_base_id, messenger_user_id }) => {
  
}


let getUserPromos = (messenger_user_id) => async (practice_base_id) => {
  let usersTable = getUsersTable(practice_base_id);
  let getUsers = getDataFromTable(usersTable);

  let promosTable = getPromosTable(practice_base_id);
  let getPromos = getAllDataFromTable(promosTable);
  
  let filterByFormula = `{messenger user id} = '${messenger_user_id}'`;
  let [user] = await getUsers({ filterByFormula });

  let promo_ids = user.fields['Promos Claimed'];
  
  let view = 
  let promos = await getPromos();
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
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