let { getUserByMessengerID, createUser, updateUser } = require('../../libs/users.js');

let createNewUserData = (data) => {
  let { 
    search_providers_state, 
    search_providers_city, 
    search_providers_zip_code,
    messenger_user_id,
    first_name,
    last_name,
    gender,
  } = data;

  let last_state_searched = search_providers_state ? search_providers_state.trim().toLowerCase() : null;
  let last_city_searched = search_providers_city ? search_providers_city.trim().toLowerCase() : null;
  let last_zip_code_searched = search_providers_zip_code ? Number(search_providers_zip_code.trim()) : null;

  let new_user_data = {
    'messenger user id': messenger_user_id,
    'User Type': 'CONSUMER',
    'First Name': first_name,
    'Last Name': last_name,
    'Gender': gender,
    'Last State Searched': last_state_searched,
    'Last City Searched': last_city_searched,
    'Last Zip Code Searched': last_zip_code_searched,
  }
  
  return new_user_data;
}

let createUpdateUserData = ({ last_state_searched, last_city_searched, last_zip_code_searched }) => {
  let update_user_data = {};

  if (last_state_searched) update_user_data['Last State Searched'] = last_state_searched;
  if (last_city_searched) update_user_data['Last City Searched'] = last_city_searched;
  if (last_zip_code_searched) update_user_data['Last Zip Code Searched'] = last_zip_code_searched;

  return update_user_data;  
}

let createOrUpdateUser = async (user, query) => {
  let { messenger_user_id, first_name, last_name, gender } = query;
  let { search_providers_state, search_providers_city, search_providers_zip_code } = query;

  if (!user) {
    let new_user_data = createNewUserData({ search_providers_state, search_providers_city, search_providers_zip_code, messenger_user_id, first_name, last_name, gender });
		let newUser = await createUser(new_user_data);
    return newUser;
	}

  let update_user_data = createUpdateUserData();

  let updatedUser = await updateUser(update_user_data, user);
  return updatedUser;
}

