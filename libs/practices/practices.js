let { DEFAULT_PRACTICE_IMAGE, LIST_YOUR_PRACTICE_IMAGE_URL } = process.env;

let { createBtn } = require('../../libs/bots.js');

let { getUserByMessengerID, createUser, updateUser } = require('../../libs/data/users.js');
let { getPracticesByState, getPracticesByCity } = require('../../libs/data/practices.js');

let createNewUser = async (data) => {
  let { zip_code, messenger_user_id, first_name, last_name, gender } = data;

  let new_user_data = {
    'messenger user id': messenger_user_id,
    'User Type': 'CONSUMER',
    'First Name': first_name,
    'Last Name': last_name,
    'Gender': gender,
    'Last Zip Code Searched': Number(zip_code.trim()),
  }
  
  let new_user = await createUser(new_user_data);
  return new_user;
}

let createUpdatedUser = async (data) => {
  let { zip_code, user } = data;
  
  let update_user_data = {
    ['Last Zip Code Searched']: Number(zip_code.trim())
  }

  let updated_user = await updateUser(update_user_data, user);
  return updated_user;
}

// Exported Functions
let createOrUpdateUser = async (user, data) => {
  let { zip_code, messenger_user_id, first_name, last_name, gender } = data;

  if (!user) {
    let new_user = await createNewUser(
      { zip_code, messenger_user_id, first_name, last_name, gender }
    );

    return new_user;
	}

  let updated_user = await createUpdatedUser(
    { zip_code, user }
  );

  return updated_user;
}

let toGalleryElement = ({ id: practice_id, fields: practice }) => {
  let title = practice['Practice Name'].slice(0, 80);
  let subtitle = `${practice['Main Provider']} | ${practice['Practice Address']}`;
  
  let image_url = practice['Main Provider Image'] ?
    practice['Main Provider Image'][0].url :
    DEFAULT_PRACTICE_IMAGE;
  
  let view_services_btn = createBtn(
    `View Services|show_block|[JSON] Get Practice Services`,
    { practice_id }
  );

  let view_promos_btn = createBtn(
    `View Promos|show_block|[JSON] Get Practice Promos`,
    { practice_id }  
  );

  let buttons = [view_services_btn, view_promos_btn];

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