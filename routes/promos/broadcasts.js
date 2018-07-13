let { getUserByMessengerID } = require('../../libs/data/users.js');

let getPromos = require('../../routes/promos/promos.js');

let findPromosOffLastSearch = async ({ query, params }, res) => {
  let { search_type } = params;
  let { messenger_user_id } = query;

  let user = await getUserByMessengerID(messenger_user_id);
  let first_name = user.fields['First Name'];
  let last_name = user.fields['Last Name'];
  let gender = user.fields['Gender'];
  
  let search_promos_state = (search_type === 'state') ? user.fields['Last State Searched'] : null;
  let search_promos_city = (search_type === 'state') ? user.fields['Last City Searched'] : null;
  
  let new_query = { messenger_user_id, first_name, last_name, gender, search_promos_state, search_promos_city };

  getPromos(
    { query: new_query }, res
  );
}

module.exports = findPromosOffLastSearch;