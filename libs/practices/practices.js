let { BASEURL, PRACTICE_DATABASE_BASE_ID, DEFAULT_PRACTICE_IMAGE, SEARCH_PRACTICES_MORE_OPTIONS_IMAGE_URL } = process.env;

let { createURL } = require('../../libs/helpers.js');
let { createBtn } = require('../../libs/bots.js');

let { getUserByMessengerID, createUser, updateUser } = require('../../libs/data/users.js');
let { getPracticesByState, getPracticesByCity } = require('../../libs/data/practices.js');

let createNewUserData = (data) => {
  let { messenger_user_id, first_name, last_name, gender } = data;

  let { search_practices_state, search_practices_city, search_practices_zip_code } = data;

  let last_state_searched = search_practices_state ? search_practices_state.trim().toLowerCase() : null;
  let last_city_searched = search_practices_city ? search_practices_city.trim().toLowerCase() : null;
  let last_zip_code_searched = search_practices_zip_code ? Number(search_practices_zip_code.trim()) : null;

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

let createUpdateUserData = ({ search_practices_state, search_practices_city, search_practices_zip_code }) => {
  let update_user_data = {};

  let last_state_searched = search_practices_state ? search_practices_state.trim().toLowerCase() : null;
  let last_city_searched = search_practices_city ? search_practices_city.trim().toLowerCase() : null;
  let last_zip_code_searched = search_practices_zip_code ? Number(search_practices_zip_code.trim()) : null;

  if (last_state_searched) update_user_data['Last State Searched'] = last_state_searched;
  if (last_city_searched) update_user_data['Last City Searched'] = last_city_searched;
  if (last_zip_code_searched) update_user_data['Last Zip Code Searched'] = last_zip_code_searched;

  return update_user_data;  
}

let createButtons = (practice, data) => {
  let { practice_id, practice_base_id, first_name, last_name, gender, messenger_user_id } = data;

  let is_practice_active = practice['Active?'];
  let is_practice_claimed = practice['Claimed?'];

  if (is_practice_active) {
    let view_services_btn_url = createURL(
      `${BASEURL}/practices/services`,
      { practice_id, practice_base_id, first_name, last_name, gender, messenger_user_id }
    );

    let view_promos_btn_url = createURL(
      `${BASEURL}/practices/promos`,
      { practice_id, practice_base_id, first_name, last_name, gender, messenger_user_id }  
    );

    let btn1 = createBtn(`View Services|json_plugin_url|${view_services_btn_url}`);
    let btn2 = createBtn(`View Promos|json_plugin_url|${view_promos_btn_url}`);

    return [btn1, btn2];
  }

  if (!is_practice_claimed) {
    let claim_practice_url = createURL(
      `${BASEURL}/practices/claim/user_info`,
      { practice_id, practice_base_id, first_name, last_name, gender, messenger_user_id }
    );

    let btn = createBtn(`Claim Practice|json_plugin_url|${claim_practice_url}`);

    return [btn];
  }

  if (is_practice_claimed && !is_practice_active) {
    let { messenger_user_id } = data;

    let already_claimed_url = createURL(
      `${BASEURL}/practices/claimed`,
      { messenger_user_id }
    );

    let btn = createBtn(`Already Claimed|json_plugin_url|${already_claimed_url}`);

    return [btn];
  }
}

// Booking Site and Site URL Only
let createButtons2 = (practice, data) => {
  let is_practice_active = practice['Active?'];
  let is_practice_claimed = practice['Claimed?'];

  let view_practice_site_url = practice['Practice Website'];
  let view_practice_book_url = practice['Practice Booking URL'];

  let btns = [];

  if (view_practice_site_url) {
    let btn = createBtn(`Visit Provider Site|web_url|${view_practice_site_url}`);
    btns.push(btn);
  }

  if (view_practice_book_url) {
    let btn = createBtn(`Visit Booking Site|web_url|${view_practice_book_url}`);
    btns.push(btn);
  }

  return btns;
}

// Exported Functions
let createOrUpdateUser = async (user, query) => {
  let { messenger_user_id, first_name, last_name, gender } = query;
  let { search_practices_state, search_practices_city, search_practices_zip_code } = query;

  if (!user) {
    let new_user_data = createNewUserData(
      { search_practices_state, search_practices_city, search_practices_zip_code, messenger_user_id, first_name, last_name, gender }
    );

		let newUser = await createUser(new_user_data);
    return newUser;
	}

  let update_user_data = createUpdateUserData(
    { search_practices_state, search_practices_city, search_practices_zip_code }
  );

  let updatedUser = await updateUser(update_user_data, user);
  return updatedUser;
}

let toGalleryElement = (data) => ({ id: practice_id, fields: practice }) => {
  let { first_name, last_name, gender, messenger_user_id } = data;

  let title = practice['Practice Name'].slice(0, 80);
  let subtitle = `${practice['Main Provider']} | ${practice['Practice Address']}`;
  let image_url = practice['Main Provider Image'] ? practice['Main Provider Image'][0].url : DEFAULT_PRACTICE_IMAGE;

  let practice_base_id = practice['Practice Base ID'];
  let buttons = createButtons(
    practice,
    { practice_id, practice_base_id, first_name, last_name, gender, messenger_user_id }
  );

  let element = { title, subtitle, image_url, buttons };
  return element;
}

let createLastGalleryElement = () => {
  let title = 'More Options';
  let image_url = SEARCH_PRACTICES_MORE_OPTIONS_IMAGE_URL;

  // Buttons
  let btn1 = createBtn(`List My Practice|show_block|List Practice`);
  let btn2 = createBtn(`Main Menu|show_block|Discover Main Menu`);
  let btn3 = createBtn(`About Bevl Beauty|show_block|About Bevl Beauty`);

  let buttons = [btn1, btn2, btn3];

  let last_gallery_element = { title, buttons };
  return last_gallery_element;
}

module.exports = {
  createOrUpdateUser,
  toGalleryElement,
  createLastGalleryElement,
}