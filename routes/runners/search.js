let { getRunnerByMessengerID, getRunnersByZipCode, createRunner } = require('../../libs/data/runners.js');

let { createBtn, createGallery } = require('../../libs/bots.js');

let createNewRunner = async (data) => {
  let { messenger_user_id, first_name, last_name, gender, zip_code } = data;

  let new_runner_data = {
    ['messenger_user_id']: messenger_user_id,
    ['First Name']: first_name,
    ['Last Name']: last_name,
    ['Gender']: gender,
    ['Zip Code']: zip_code,
  }

  let new_runner = await createRunner(new_runner_data);

  return new_runner;
}

let toGalleryData = (search_runner) => (runner) => {
  let title = `${runner.fields['First Name']} ${runner.fields['Last Name']}`;
  let image_url = `${runner.fields['Profile Image URL']}`;
  
  let send_request_btn = createBtn(
    ``,
    {  }
  );
  
  let buttons = [send_request_btn];

  return { title, image_url, buttons }l
  
}

let searchRunners = async ({ params, query }, res) => {
  let { zip_code } = params;
  let { messenger_user_id, first_name, last_name, gender } = query;

  let runner = await getRunnerByMessengerID(messenger_user_id);

  if (!runner) {
    runner = await createNewRunner(
      { messenger_user_id, first_name, last_name, gender, zip_code }
    );
  }

  let runners = await getRunnersByZipCode(
    { zip_code }
  );

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