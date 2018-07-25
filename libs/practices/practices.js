let { BASEURL, DEFAULT_PRACTICE_IMAGE, LIST_YOUR_PRACTICE_IMAGE_URL } = process.env;

let { createURL } = require('../../libs/helpers.js');
let { createBtn } = require('../../libs/bots.js');

let { getUserByMessengerID, createUser, updateUser } = require('../../libs/data/users.js');
let { getPracticesByState, getPracticesByCity } = require('../../libs/data/practices.js');

let createNewUserData = (data) => {
  let { search_practices_zip_code, messenger_user_id, first_name, last_name, gender } = data;

  let last_zip_code_searched = search_practices_zip_code ? Number(search_practices_zip_code.trim()) : null;

  let new_user_data = {
    'messenger user id': messenger_user_id,
    'User Type': 'CONSUMER',
    'First Name': first_name,
    'Last Name': last_name,
    'Gender': gender,
    'Last Zip Code Searched': last_zip_code_searched,
  }

  return new_user_data;
}

let createUpdateUserData = ({ search_practices_zip_code }) => {
  let update_user_data = {};

  let last_zip_code_searched = search_practices_zip_code ? 
    Number(search_practices_zip_code.trim()) :
    null;

  if (last_zip_code_searched) {
    update_user_data['Last Zip Code Searched'] = last_zip_code_searched
  }

  return update_user_data;  
}

let createButtons = (data) => {
  let { practice_id } = data;

  let view_services_btn_url = createURL(
    `${BASEURL}/practices/services`,
    { practice_id }
  );

  let view_promos_btn_url = createURL(
    `${BASEURL}/practices/promos`,
    { practice_id }  
  );

  let btn1 = createBtn(`View Services|json_plugin_url|${view_services_btn_url}`);
  let btn2 = createBtn(`View Promos|json_plugin_url|${view_promos_btn_url}`);

  return [btn1, btn2];
}

// Exported Functions
let createOrUpdateUser = async (user, query) => {
  let { search_practices_zip_code, messenger_user_id, first_name, last_name, gender } = query;

  if (!user) {
    let new_user_data = createNewUserData(
      { search_practices_zip_code, messenger_user_id, first_name, last_name, gender }
    );

		let new_user = await createUser(new_user_data);
    return new_user;
	}

  let update_user_data = createUpdateUserData(
    { search_practices_zip_code }
  );

  let updated_user = await updateUser(update_user_data, user);
  return updated_user;
}

let toGalleryElement = ({ id: practice_id, fields: practice }) => {
  let title = practice['Practice Name'].slice(0, 80);
  let subtitle = `${practice['Main Provider']} | ${practice['Practice Address']}`;
  
  let image_url = practice['Main Provider Image'] ?
    practice['Main Provider Image'][0].url :
    DEFAULT_PRACTICE_IMAGE;

  let buttons = createButtons(
    { practice_id }
  );

  return { title, subtitle, image_url, buttons };
}

let createLastGalleryElement = () => {
  let title = 'List Your Practice';
  let image_url = LIST_YOUR_PRACTICE_IMAGE_URL;

  let btn1 = createBtn(`List My Practice|show_block|[JSON] List Practice Route`);
  let btn2 = createBtn(`Main Menu|show_block|Main Menu`);
  let btn3 = createBtn(`About Bevl Beauty|show_block|AboutBB`);

  let buttons = [btn1, btn2, btn3];

  return { title, image_url, buttons };
}

module.exports = {
  createOrUpdateUser,
  toGalleryElement,
  createLastGalleryElement,
}