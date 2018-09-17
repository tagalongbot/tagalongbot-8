let { getRunnerByMessengerID, createRunner } = require('../../libs/data/runners.js');

let { uploadCloudinaryImage, getFaceFromImage } = require('../../libs/cloudinary.js');

let createNewRunner = async ({ query }, res) => {
  let { messenger_user_id, first_name, last_name, gender, zip_code, latitude, longitude, messenger_link, profile_image } = query;

  let runner = await getRunnerByMessengerID(messenger_user_id);

  if (runner) {
    let redirect_to_blocks = ['Profile Already Created'];
    res.send({ redirect_to_blocks });
    return;
  }

  let new_profile_image_url = await uploadCloudinaryImage(
    { image_url: profile_image }
  );

  let face_profile_image_url = await getFaceFromImage(
    { image_url: new_profile_image_url }
  );

  let new_runner_data = {
    ['messenger user id']: messenger_user_id,
    ['Active?']: true,
    ['First Name']: first_name,
    ['Last Name']: last_name,
    ['Gender']: gender,
    ['Zip Code']: zip_code,
    ['Latitude']: Number(latitude),
    ['Longitude']: Number(longitude),
    ['Messenger Link']: messenger_link,
    ['Profile Image URL']: face_profile_image_url,
  }

  let new_runner = await createRunner(new_runner_data);

  let redirect_to_blocks = ['New Profile Created'];

  res.send({ redirect_to_blocks });
}

module.exports = createNewRunner;