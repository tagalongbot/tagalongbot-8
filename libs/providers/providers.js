let { BASEURL, PRACTICE_DATABASE_BASE_ID, DEFAULT_PROVIDER_IMAGE, SEARCH_PROVIDERS_MORE_OPTIONS_IMAGE_URL } = process.env;
let { createURL } = require('../../libs/helpers');
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

let createUpdateUserData = ({ search_providers_state, search_providers_city, search_providers_zip_code }) => {
  let update_user_data = {};

  let last_state_searched = search_providers_state ? search_providers_state.trim().toLowerCase() : null;
  let last_city_searched = search_providers_city ? search_providers_city.trim().toLowerCase() : null;
  let last_zip_code_searched = search_providers_zip_code ? Number(search_providers_zip_code.trim()) : null;

  if (last_state_searched) update_user_data['Last State Searched'] = last_state_searched;
  if (last_city_searched) update_user_data['Last City Searched'] = last_city_searched;
  if (last_zip_code_searched) update_user_data['Last Zip Code Searched'] = last_zip_code_searched;

  return update_user_data;  
}

let createOrUpdateUser = async (user, query) => {
  let { messenger_user_id, first_name, last_name, gender } = query;
  let { search_providers_state, search_providers_city, search_providers_zip_code } = query;

  if (!user) {
    let new_user_data = createNewUserData(
      { search_providers_state, search_providers_city, search_providers_zip_code, messenger_user_id, first_name, last_name, gender }
    );

		let newUser = await createUser(new_user_data);
    return newUser;
	}

  let update_user_data = createUpdateUserData(
    { search_providers_state, search_providers_city, search_providers_zip_code }
  );

  let updatedUser = await updateUser(update_user_data, user);
  return updatedUser;
}

let createButtons = (provider, data) => {
  let is_provider_active = provider['Active?'];
  let is_provider_claimed = provider['Claimed?'];

  if (is_provider_active) {
    let view_services_btn_url = createURL(`${BASEURL}/providers/services`, data);
    let view_promos_btn_url = createURL(`${BASEURL}/providers/promos`, data);

    let btn1 = {
      title: 'View Services',
      type: 'json_plugin_url',
      url: view_services_btn_url,
    }

    let btn2 = {
      title: 'View Promos',
      type: 'json_plugin_url',
      url: view_promos_btn_url,
    }

    return [btn1, btn2];
  }

  if (!is_provider_claimed) {
    let claim_practice_url = createURL(`${BASEURL}/providers/claim/email`, data);

    let btn = {
      title: 'Claim Practice',
      type: 'json_plugin_url',
      url: claim_practice_url
    }

    return [btn];
  }

  if (is_provider_claimed && !is_provider_active) {
    let { messenger_user_id } = data;
    let already_claimed_url = createURL(`${BASEURL}/providers/claimed`, { messenger_user_id });

    let btn = {
      title: 'Already Claimed',
      type: 'json_plugin_url',
      url: already_claimed_url
    }
    
    return [btn];
  }
}

// Booking Site and Site URL Only
let createButtons2 = (provider, data) => {
  let is_provider_active = provider['Active?'];
  let is_provider_claimed = provider['Claimed?'];

  let view_provider_site_url = provider['Practice Website'];
  let view_provider_book_url = provider['Practice Booking URL'];

  let btns = [];

  if (view_provider_site_url) {
    let btn = {
      title: 'Visit Provider Site',
      type: 'web_url',
      url: view_provider_site_url,
    }

    btns.push(btn);
  }

  if (view_provider_book_url) {
    let btn = {
      title: 'Visit Booking Site',
      type: 'web_url',
      url: view_provider_book_url,
    }

    btns.push(btn);
  }

  return btns;
}

let toGalleryElement = ({ first_name, last_name, gender, messenger_user_id }) => ({ id: provider_id, fields: provider }) => {
  let title = provider['Practice Name'].slice(0, 80);
  let subtitle = `${provider['Main Provider']} | ${provider['Practice Address']}`;
  let image_url = provider['Main Provider Image'] ? provider['Main Provider Image'][0].url : DEFAULT_PROVIDER_IMAGE;

  let provider_base_id = provider['Practice Base ID'];
  let data = { provider_id, provider_base_id, first_name, last_name, gender, messenger_user_id };
  let buttons = createButtons(provider, data);

  let element = { title, subtitle, image_url, buttons };
  return element;
}

let createLastGalleryElement = () => {
  let title = 'More Options';
  let image_url = SEARCH_PROVIDERS_MORE_OPTIONS_IMAGE_URL;

  // Buttons
  let btn1 = {
    title: 'List My Practice',
    type: 'show_block',
    block_name: 'List Practice',
  }

  let btn2 = {
    title: 'Main Menu',
    type: 'show_block',
    block_name: 'Discover Main Menu',
  }

  let btn3 = {
    title: 'About Bevl Beauty',
    type: 'show_block',
    block_name: 'About Bevl Beauty',
  }

  let buttons = [btn1, btn2, btn3];

  let last_gallery_element = { title, buttons };
  return last_gallery_element;
}

module.exports = {
  createOrUpdateUser,
  toGalleryElement,
  createLastGalleryElement,
}