let { USERS_BASE_ID } = process.env;

let { createURL } = require('../libs/helpers');
let { createMultiGallery } = require('../libs/bots');
let { getTable, getAllDataFromTable } = require('../libs/data');

let getUsersTable = getTable('Users');

let { getUserByMessengerID } = require('../libs/users');

let getUserPromos = (messenger_user_id) => async () => {
  
}

let viewClaimedPromos = async ({ query }, res) => {
  let messenger_user_id = query['messenger user id'];

  let user = await getUserByMessengerID(messenger_user_id);
  
  let practice_ids = user.fields['Practices Claimed Promos From'].split(',');
  
  let promos = Promise.all(
    practice_ids.map(getUserPromos(messenger_user_id))
  );
  
}

module.exports = viewClaimedPromos;