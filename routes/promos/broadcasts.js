let { getUserByMessengerID } = require('../../libs/data/users.js');

let getPromos = require('../../routes/promos/promos.js');

let findPromos = async ({ query, params }, res) => {
  let { search_type } = params;
  let { messenger_user_id } = query;

  let user = await getUserByMessengerID(messenger_user_id);

  let search_promos_state = (search_type === 'state') ? user.fields['Last State Searched'] : null;
  let search_promos_city = (search_type === 'state') ? user.fields['Last City Searched'] : null;

  getPromos(
    { search_promos_state, search_promos_city }, res
  );
}

module.exports = findPromos;