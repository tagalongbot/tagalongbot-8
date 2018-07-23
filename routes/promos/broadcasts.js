let { getUserByMessengerID } = require('../../libs/data/users.js');

let getPromos = require('../../routes/promos/promos.js');

let findPromosOffLastSearch = async ({ query }, res) => {
  let { messenger_user_id } = query;

  let user = await getUserByMessengerID(messenger_user_id);
  let first_name = user.fields['First Name'];
  let last_name = user.fields['Last Name'];
  let gender = user.fields['Gender'];
  
  let zip_code = user.fields['Last Zip Code Searched'] || null;
  
  let new_query = { messenger_user_id, first_name, last_name, gender };
  let params = { zip_code };

  getPromos(
    { query: new_query, params },
    res
  );
}

module.exports = findPromosOffLastSearch;