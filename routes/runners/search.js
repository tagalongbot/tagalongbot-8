let { getRunnerByMessengerID, getRunnersByZipCode, createRunner } = require('../../libs/data/runners.js');

let { createBtn, createGallery } = require('../../libs/bots.js');

let createNewRunner = async (data) => {
  let { messenger_user_id, first_name, last_name, gender, zip_code, messenger_link } = data;

  let new_runner_data = {
    ['messenger_user_id']: messenger_user_id,
    ['First Name']: first_name,
    ['Last Name']: last_name,
    ['Gender']: gender,
    ['Zip Code']: zip_code,
    ['Messenger Link']: messenger_link
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

let searchRunners = async ({ params, query }, res) => {
  let { zip_code } = params;
  let { 
    messenger_user_id,
    first_name,
    last_name,
    gender,
    messenger_link,
    search_gender,
    search_miles,
  } = query;

  let runner = await getRunnerByMessengerID(messenger_user_id);

  if (!runner) {
    runner = await createNewRunner(
      { messenger_user_id, first_name, last_name, gender, zip_code, messenger_link }
    );
  }

  let runners = await getRunnersByZipCode(
    { zip_code }
  );

  if (!runners[0]) {
    let redirect_to_blocks = ['No Running Partners Found'];
    res.send({ redirect_to_blocks });
    return;
  }

  let gallery_data = runners.map(
    toGalleryData(runner)
  );

  let gallery = createGallery(
    gallery_data
  );

  let messages = [gallery];

  res.send({ messages });
}

module.exports = searchRunners;