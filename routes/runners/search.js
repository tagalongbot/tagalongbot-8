let { getRunnerByMessengerID, searchNearbyRunners, createRunner } = require('../../libs/data/runners.js');

let { uploadFaceImage } = require('../../libs/cloudinary.js');

let { createBtn, createGallery } = require('../../libs/bots.js');

let createNewRunner = async (data) => {
  let { messenger_user_id, first_name, last_name, gender, zip_code, messenger_link, profile_image } = data;

  let face_profile_image = await uploadFaceImage(
    { image_url: profile_image }
  );

  let new_runner_data = {
    ['messenger user id']: messenger_user_id,
    ['Active?']: true,
    ['First Name']: first_name,
    ['Last Name']: last_name,
    ['Gender']: gender,
    ['Zip Code']: Number(zip_code),
    ['Messenger Link']: messenger_link,
    ['Profile Image URL']: profile_image,
  }

  let new_runner = await createRunner(new_runner_data);

  return new_runner;
}

let toGalleryData = (search_runner) => (runner) => {
  let runner_messenger_user_id = runner.fields['messenger_user_id'];

  let title = `${runner.fields['First Name']} ${runner.fields['Last Name']}`;
  let image_url = `${runner.fields['Profile Image URL']}`;

  let send_request_btn = createBtn(
    `Send Request|show_block|[JSON] Send Partner Request`,
    { runner_messenger_user_id }
  );

  let buttons = [send_request_btn];

  return { title, image_url, buttons };
}

let searchRunners = async ({ query }, res) => {
  let {
    messenger_user_id,
    first_name,
    last_name,
    gender,
    messenger_link,
    search_gender,
    search_miles,
    zip_code,
    profile_image,
  } = query;

  let runner = await getRunnerByMessengerID(messenger_user_id);

  if (!runner) {
    runner = await createNewRunner(
      { messenger_user_id, first_name, last_name, gender, zip_code, messenger_link, profile_image }
    );
  }

  let mile_radius = {
    ['5 Miles']: 5,
    ['10 Miles']: 10,
    ['15 Miles']: 15,
    ['20 Miles']: 20,
  }[search_miles];

  let runners = await searchNearbyRunners(
    { zip_code, mile_radius }
  );

  let matched_runners = runners.filter(
    runner => runner.fields['Gender'].toLowerCase() === search_gender.toLowerCase()
  );

  if (!matched_runners[0]) {
    let redirect_to_blocks = ['No Running Partners Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let gallery_data = matched_runners.map(
    toGalleryData(runner)
  );

  let gallery = createGallery(
    gallery_data
  );
  
  let messages = [gallery];

  res.send({ messages });
}

module.exports = searchRunners;